import { ExchangeNames, NotFoundError, RoutingKeys } from '@cngvc/shopi-shared';
import { ElasticsearchIndexes, IBuyerDocument, IEmailLocals, IOrderDocument } from '@cngvc/shopi-types';
import { config } from '@order/config';
import { elasticSearch } from '@order/elasticsearch';
import { grpcCartClient } from '@order/grpc/clients/cart-client.grpc';
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

    const order = await OrderModel.create({
      buyerPublicId: buyer.buyerPublicId,
      buyerAuthId: authId,
      items: itemsInCart,
      shippingFee: 0,
      shipping: buyer.shippingAddress,
      payment: {
        method: buyer.payment!.method
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
}

export const orderService = new OrderService();
