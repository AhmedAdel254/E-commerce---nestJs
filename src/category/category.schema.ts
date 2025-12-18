import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true })
export class Category {
  //name
  @Prop({
    type: String,
    required: true,
    min: [3, 'Name is too short'],
    max: [20, 'Name is too long'],
  })
  name: string;
  //image
  @Prop({
    type: String,
  })
  image: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
