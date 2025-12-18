import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Category } from 'src/category/category.schema';

export type SubCategoryDocument = HydratedDocument<SubCategory>;

@Schema({ timestamps: true })
export class SubCategory {
  //name
  @Prop({
    type: String,
    required: true,
    min: [3, 'Name is too short'],
    max: [20, 'Name is too long'],
  })
  name: string;
  //categoryId
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Category.name,
    required: true,
  })
  category: string;
}

export const SubCategorySchema = SchemaFactory.createForClass(SubCategory);
