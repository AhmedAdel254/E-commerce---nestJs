import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CouponDocument = HydratedDocument<Coupon>;

@Schema({ timestamps: true })
export class Coupon {
  //name
  @Prop({
    type: String,
    required: true,
    min: [3, 'Name is too short'],
    max: [100, 'Name is too long'],
  })
  name: string;
  //Expiry Date
  @Prop({
    type: Date,
    required: true,
    min: new Date(),
  })
  expiryDate: Date;
  //Discount
  @Prop({
    type: Number,
    required: true,
  })
  discount: number;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);
