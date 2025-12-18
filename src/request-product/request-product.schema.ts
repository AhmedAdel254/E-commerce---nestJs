import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/user/user.schema';

export type RequestProductsDocument = HydratedDocument<RequestProducts>;

@Schema({ timestamps: true })
export class RequestProducts {
  //titleNeed
  @Prop({
    type: String,
    required: true,
  })
  titleNeed: string;
  //details
  @Prop({
    type: String,
    required: true,
    min: [5, 'Name is too short'],
  })
  details: string;
  //quantity
  @Prop({
    type: Number,
    required: true,
    min: [1, 'quantity must be at least 1 product'],
  })
  quantity: number;
  //catecory
  @Prop({
    type: String,
  })
  catecory: string;
  //user
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  user: {
    _id: string;
  };
}

export const RequestProductsSchema =
  SchemaFactory.createForClass(RequestProducts);
