import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Coupon } from 'src/coupon/coupon.schema';
import { Product } from 'src/product/product.schema';
import { User } from 'src/user/user.schema';

export type CartDocument = HydratedDocument<Cart>;

@Schema({ timestamps: true })
export class Cart {
  //cartItems
  @Prop({
    type: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: Product.name },
        quantity: { type: Number, default: 1 },
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
  //totalPrice
  @Prop({ required: true, type: Number })
  totalPrice: number;
  //totalPriceAfterDiscount
  @Prop({ required: false, type: Number })
  totalPriceAfterDiscount: number;
  //coupon
  @Prop({
    type: [
      {
        name: { type: String },
        copounId: { type: mongoose.Schema.Types.ObjectId, ref: Coupon.name },
      },
    ],
  })
  coupon: [
    {
      name: string;
      couponId: string;
    },
  ];
  //user
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  user: string;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
