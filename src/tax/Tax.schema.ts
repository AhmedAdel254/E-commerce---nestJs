import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TexDocument = HydratedDocument<Tax>;

@Schema({ timestamps: true })
export class Tax {
  //Tax price
  @Prop({
    type: Number,
    default: 0,
  })
  taxPrice: number;
  //shippingPrice
  @Prop({
    type: Number,
    default: 0,
  })
  shippingPrice: number;
}

export const TaxSchema = SchemaFactory.createForClass(Tax);
