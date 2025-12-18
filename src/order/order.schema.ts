import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { HydratedDocument } from 'mongoose';
import { Product } from 'src/product/product.schema';
import { User } from 'src/user/user.schema';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
  //user
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user: typeof User;
  //cart items
  @Prop({
    type: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: Product.name },
        quantity: { type: Number, required: true },
        color: { type: String, default: '' },
      },
    ],
  })
  cartItems: [
    {
      productId: {
        _id: string;
      };
      quantity: number;
      color: string;
    },
  ];
  //taxPrice
  @Prop({ type: Number, required: false, default: 0.0 })
  taxPrice: number;
  //sessionID
  @Prop({ type: String, required: false })
  sessionId: string;
  //shippingPrice
  @Prop({ type: Number, required: false, default: 0.0 })
  shippingPrice: number;
  //totalOrderPrice
  @Prop({ type: Number, required: true })
  totalOrderPrice: number;
  //paymentMethod
  @Prop({
    type: String,
    required: false,
    enum: ['cash', 'card'],
    default: 'card',
  })
  paymentMethod: string;
  //isPaid
  @Prop({ type: Boolean, default: false, required: false })
  isPaid: boolean;
  //paidAt
  @Prop({ type: Date, required: false })
  paidAt: Date;
  //isDelivered
  @Prop({ type: Boolean, default: false, required: false })
  isDelivered: boolean;
  //deliveredAt
  @Prop({ type: Date, required: false })
  deliveredAt: Date;
  //shippingAddress
  @Prop({
    type: String,
  })
  shippingAddress: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
