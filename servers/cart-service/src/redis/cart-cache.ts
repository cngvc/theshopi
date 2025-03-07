import { REDIS_USERS_STATE_EXPIRE } from '@cart/constants';
import { redisCache } from '@cart/redis/redis.connection';
import { ICartItem } from '@cngvc/shopi-shared-types';

class CartCache {
  private async modifyCart(
    key: string,
    productId: string,
    modifier: (items: ICartItem[], index: number) => ICartItem[]
  ): Promise<ICartItem[]> {
    const savedCart = await redisCache.client.lrange(key, 0, -1);
    let items: ICartItem[] = savedCart.map((item) => JSON.parse(item));
    const index = items.findIndex((item) => item.productId === productId);

    const updatedItems = modifier(items, index);
    if (updatedItems) {
      await redisCache.client.del(key);
      if (updatedItems.length > 0) {
        await redisCache.client.rpush(key, ...updatedItems.map((ci) => JSON.stringify(ci)));
        await redisCache.client.expire(key, REDIS_USERS_STATE_EXPIRE);
      }
      return updatedItems;
    }

    return items;
  }

  async getCart(key: string): Promise<ICartItem[]> {
    const response = await redisCache.client.lrange(key, 0, -1);
    return response.map((e) => JSON.parse(e));
  }

  async updateCart(key: string, productId: string, amount: number = 1): Promise<ICartItem[]> {
    return this.modifyCart(key, productId, (items, index) => {
      if (index !== -1) {
        items[index].quantity = Math.max(amount, 1);
      } else {
        items.push({ productId, quantity: Math.max(amount, 1) });
      }
      return items;
    });
  }

  async saveCart(key: string, productId: string, amount: number = 1): Promise<ICartItem[]> {
    return this.modifyCart(key, productId, (items, index) => {
      if (index !== -1) {
        items[index].quantity += Math.max(amount, 1);
      } else {
        items.push({ productId, quantity: Math.max(amount, 1) });
      }
      return items;
    });
  }

  async increaseItemInCart(key: string, productId: string): Promise<ICartItem[]> {
    return this.modifyCart(key, productId, (items, index) => {
      if (index !== -1) {
        items[index].quantity += 1;
      }
      return items;
    });
  }

  async decreaseItemInCart(key: string, productId: string): Promise<ICartItem[]> {
    return this.modifyCart(key, productId, (items, index) => {
      if (index !== -1) {
        items[index].quantity -= 1;
        if (items[index].quantity <= 0) {
          items.splice(index, 1);
        }
      }
      return items;
    });
  }

  async removeItemInCart(key: string, productId: string): Promise<ICartItem[]> {
    return this.modifyCart(key, productId, (items) => {
      return items.filter((item) => item.productId !== productId);
    });
  }
}

export const cartCache = new CartCache();
