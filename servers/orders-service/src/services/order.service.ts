import { ExchangeNames, NotFoundError, RoutingKeys } from '@cngvc/shopi-shared';
import { ElasticsearchIndexes, IBuyerDocument, IEmailLocals, IOrderDocument, IOrderItem, IProductDocument } from '@cngvc/shopi-types';
import { config } from '@order/config';
import { elasticSearch } from '@order/elasticsearch';
import { grpcCartClient } from '@order/grpc/clients/cart-client.grpc';
import { grpcProductClient } from '@order/grpc/clients/product-client.grpc';
import { grpcUserClient } from '@order/grpc/clients/user-client.grpc';
import { OrderModel } from '@order/models/order.schema';
import { orderProducer } from '@order/queues/order.producer';
import { orderChannel } from '@order/server';

class OrderService {
  createOrder = async (authId: string, payload: IOrderDocument): Promise<IOrderDocument> => {
    const buyer = await this.findCachedBuyerByAuthId(authId);
    if (!buyer?.shippingAddress) {
      throw new NotFoundError('Buyer shipping address not found', 'createOrder');
    }
    if (!buyer?.payment) {
      throw new NotFoundError('Payment method is missing', 'createOrder');
    }

    const itemsInCart = await this.findCachedCartByAuthId(authId);
    const productPublicIds = itemsInCart.map(({ productPublicId }) => productPublicId);
    const products = await this.findProductsByProductPublicIds(productPublicIds);

    const productMap = new Map(products.map((p) => [p.productPublicId, p]));
    const orderItems = itemsInCart.map((item) => {
      const product = productMap.get(item.productPublicId);
      if (!product) {
        throw new NotFoundError(`Product ${item.productPublicId} not found`, 'createOrder');
      }
      return {
        productPublicId: item.productPublicId,
        quantity: item.quantity,
        price: product.price
      };
    });
    const order = await OrderModel.create({
      buyerPublicId: buyer.buyerPublicId,
      buyerAuthId: authId,
      items: orderItems,
      shippingFee: 0,
      shipping: buyer.shippingAddress,
      payment: {
        method: buyer.payment.method,
        transactionId: ''
      },
      isPaid: false,
      notes: payload.notes || ''
    });

    const createOrderMailObject: IEmailLocals = {
      username: buyer.username,
      receiverEmail: buyer.email,
      orderPublicId: order.orderPublicId,
      totalAmount: `${order.totalAmount}`,
      shippingAddress: buyer.shippingAddress!.address,
      shippingCity: buyer.shippingAddress!.city,
      shippingCountry: buyer.shippingAddress!.country,
      orderLink: `${config.CLIENT_URL}/orders/${order.orderPublicId}/activities`,
      template: 'create-order'
    };
    await orderProducer.publishDirectMessage(
      orderChannel,
      ExchangeNames.CREATE_ORDER_EMAIL,
      RoutingKeys.CREATE_ORDER_EMAIL,
      JSON.stringify(createOrderMailObject)
    );
    await orderProducer.publishDirectMessage(
      orderChannel,
      ExchangeNames.DELETE_COMPLETED_CART,
      RoutingKeys.DELETE_COMPLETED_CART,
      JSON.stringify({ authId })
    );
    return order;
  };

  getOrderByOrderPublicId = async (orderPublicId: string | null): Promise<IOrderDocument | null> => {
    if (!orderPublicId) return null;
    const order = await OrderModel.findOne({
      orderPublicId
    }).lean();
    if (!order) return null;

    const productPublicIds = order?.items?.map((e) => e.productPublicId);
    if (productPublicIds?.length) {
      const { products } = await grpcProductClient.getProductsByProductPublicIds(productPublicIds);
      order.items = order.items.map((item) => {
        const product = products.find((p) => p.productPublicId === item.productPublicId);
        return {
          ...product,
          ...item
        } as IOrderItem & IProductDocument;
      });
    }
    return order;
  };

  getCurrentUserOrders = async (authId: string): Promise<IOrderDocument[]> => {
    const orders = await OrderModel.find({
      buyerAuthId: authId
    }).lean();
    return orders;
  };

  private findCachedBuyerByAuthId = async (authId: string): Promise<IBuyerDocument> => {
    let buyer = await elasticSearch.getDocument<IBuyerDocument>(ElasticsearchIndexes.auth, authId);
    if (!buyer) {
      buyer = await grpcUserClient.getBuyerByAuthId(authId);
      if (!buyer) throw new NotFoundError('Buyer not found', 'findCachedBuyerByAuthId');
    }
    return buyer;
  };
  private findCachedCartByAuthId = async (authId: string) => {
    const { items } = await grpcCartClient.getCartByAuthId(authId);
    if (!items?.length) throw new NotFoundError('Cart not found', 'findCachedCartByAuthId');
    return items;
  };

  private findProductsByProductPublicIds = async (productPublicIds: string[]) => {
    const { products } = await grpcProductClient.getProductsByProductPublicIds(productPublicIds);
    if (!products?.length) {
      throw new NotFoundError('Products not found', 'findProductsByProductPublicIds');
    }
    return products;
  };
}

export const orderService = new OrderService();
