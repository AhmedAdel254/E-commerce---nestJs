/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-require-imports */
import { HttpException, Injectable } from '@nestjs/common';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './order.schema';
import { Model } from 'mongoose';
import { Cart } from 'src/cart/cart.schema';
import { Tax } from 'src/tax/Tax.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { Product } from 'src/product/product.schema';

const stripe = require('stripe')(`${process.env.STRIPE_SECRET_KEY}`);

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(Tax.name) private taxModel: Model<Tax>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}
  async create(
    user_id: string,
    paymentMethod: 'cash' | 'card',
    createOrderDto: CreateOrderDto,
    dataAfterPayment: { success_url: string; cancel_url: string },
  ) {
    const cart = await this.cartModel
      .findOne({ user_id })
      .populate('cartItems.productId user');
    if (!cart) {
      throw new HttpException('Cart not found', 404);
    }
    const tax = await this.taxModel.findOne({});

    const taxPrice = tax?.taxPrice ?? 0;
    const shippingPrice = tax?.shippingPrice ?? 0;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const shippingAddress = createOrderDto.shippingAddress ?? cart.user.address;

    if (!shippingAddress) {
      throw new HttpException('Shipping address not found', 404);
    }

    const data = {
      user: user_id,
      cartItems: cart.cartItems,
      taxPrice: taxPrice,
      shippingPrice: shippingPrice,
      totalPrice: cart.totalPrice + taxPrice + shippingPrice,
      paymentMethod,
      shippingAddress,
    };
    //call the payment gateway here
    if (paymentMethod === 'cash') {
      //insert order in db
      // reset the cart
      const order = await this.orderModel.create({
        ...data,
        isPaid: data.totalPrice === 0 ? true : false,
        paidAt: data.totalPrice === 0 ? new Date() : null,
        isDelivered: false,
      });
      if (data.totalPrice === 0) {
        cart.cartItems.forEach(async (item) => {
          await this.productModel.findByIdAndUpdate(
            item.productId._id,
            {
              $inc: {
                sold: item.quantity,
                quantity: -item.quantity,
              },
            },
            { new: true },
          );
        });
      }
      await this.cartModel.findOneAndUpdate(
        { user_id },
        { cartItems: [], totalPrice: 0 },
        { new: true },
      );
      return {
        status: 200,
        message: 'Order created successfully',
        data: order,
      };
    }
    //call the getway for card payment
    const line_items = cart.cartItems.map(({ productId, color }) => {
      return {
        price_data: {
          currency: 'egp',
          unit_amount: Math.round(data.totalPrice * 100),
          product_data: {
            // eslint-disable-next-line
            // @ts-ignore
            name: productId.title,
            // eslint-disable-next-line
            // @ts-ignore
            description: productId.description,
            // eslint-disable-next-line
            // @ts-ignore
            images: [productId.imageCover, ...productId.images],
            metadata: {
              color,
            },
          },
        },
        quantity: 1,
      };
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      success_url: dataAfterPayment.success_url,
      cancel_url: dataAfterPayment.cancel_url,

      client_reference_id: user_id.toString(),
      // eslint-disable-next-line
      // @ts-ignore
      customer_email: cart.user.email,
      metadata: {
        address: data.shippingAddress,
      },
    });

    const order = await this.orderModel.create({
      ...data,
      sessionId: session.id,
      isPaid: false,
      isDelivered: false,
    });
    return {
      status: 200,
      message: 'Checkout session created successfully',
      data: {
        url: session.url,
        sessionId: session.id,
        success_url: dataAfterPayment.success_url,
        cancel_url: dataAfterPayment.cancel_url,
        totalPrice: data.totalPrice,
        expires_at: new Date(session.expires_at * 1000),
        order: order,
      },
    };
  }
  async updatePaidCash(orderId: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.orderModel.findById(orderId);
    if (!order) {
      throw new HttpException('Order not found', 404);
    }
    if (order.paymentMethod !== 'cash') {
      throw new HttpException(
        'Only cash payment method can be updated to paid',
        400,
      );
    }
    if (order.isPaid) {
      throw new HttpException('Order is already paid', 400);
    }
    if (updateOrderDto.isPaid) {
      order.paidAt = new Date();
      //update product sold and quantity
      order.cartItems.forEach(async (item) => {
        await this.productModel.findByIdAndUpdate(
          item.productId,
          {
            $inc: {
              sold: item.quantity,
              quantity: -item.quantity,
            },
          },
          { new: true },
        );
      });
      //reset the cart
      await this.cartModel.findOneAndUpdate(
        { user_id: order.user },
        { cartItems: [], totalPrice: 0 },
        { new: true },
      );
      return {
        status: 200,
        message: 'Order paid successfully',
      };
    }
  }

  async updatePaidCard(payload: any, sig: any, endpointSecret: string) {
    let event;

    try {
      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (err) {
      console.log(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const sessionId = event.data.object.id;

        const order = await this.orderModel.findOne({ sessionId });
        if (!order) {
          throw new HttpException('Order not found', 404);
        }
        order.isPaid = true;
        order.isDelivered = true;
        order.paidAt = new Date();
        order.deliveredAt = new Date();
        const cart = await this.cartModel
          .findOne({ user: order.user.toString() })
          .populate('cartItems.productId user');

        if (!cart) {
          throw new HttpException('Cart not found', 404);
        }
        cart.cartItems.forEach(async (item) => {
          await this.productModel.findByIdAndUpdate(
            item.productId,
            { $inc: { quantity: -item.quantity, sold: item.quantity } },
            { new: true },
          );
        });

        // reset Cart
        await this.cartModel.findOneAndUpdate(
          { user: order.user.toString() },
          { cartItems: [], totalPrice: 0 },
        );

        await order.save();
        await cart.save();
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  }

  findOne(userId: string) {
    const order = this.orderModel.find({ user: userId });
    if (!order) {
      throw new HttpException('Order not found', 404);
    }
    return {
      status: 200,
      message: 'Order found successfully',
      data: order,
    };
  }

  findAll() {
    const orders = this.orderModel.find();
    if (!orders) {
      throw new HttpException('No orders found', 404);
    }
    return {
      status: 200,
      message: 'Orders found successfully',
      data: orders,
    };
  }
}
