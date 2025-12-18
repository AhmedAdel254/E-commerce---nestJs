import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Product } from 'src/product/product.schema';
import { User } from 'src/user/user.schema';

export type ReviewDocument = HydratedDocument<Review>;

@Schema({ timestamps: true })
export class Review {
  //reviewText
  @Prop({ type: String, minLength: 3 })
  reviewText: string;
  //rating
  @Prop({ type: Number, required: true, min: 1, max: 5 })
  rating: number;
  //productId
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Product.name,
    required: true,
  })
  product: string;
  //userId
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  user: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
