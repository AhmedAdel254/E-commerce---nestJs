import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Brand } from 'src/brand/brand.schema';
import { Category } from 'src/category/category.schema';
import { SubCategory } from 'src/sub_category/subCategory.schema';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  //title
  @Prop({
    type: String,
    required: true,
    minLength: [3, 'title is too short'],
  })
  title: string;
  //description
  @Prop({
    type: String,
    required: true,
    minLength: [20, 'description is too short'],
  })
  description: string;
  //quantity
  @Prop({
    type: Number,
    required: true,
    min: [1, 'quantity must be at least 1 product'],
    max: [500, 'quantity must be at most 1000 product'],
    default: 1,
  })
  quantity: number;
  //image cover
  @Prop({
    type: String,
    required: true,
  })
  imageCover: string;
  //images
  @Prop({
    type: [String],
    required: false,
  })
  images: string[];
  //sold
  @Prop({
    type: Number,
    default: 0,
  })
  sold: number;
  //price
  @Prop({
    type: Number,
    required: true,
    min: [0, 'price must be at least 0'],
    max: [20000, 'price must be at most 20000'],
  })
  price: number;
  //price after discount
  @Prop({
    type: Number,
    default: 0,
    max: [20000, 'price after discount must be at most 20000'],
  })
  priceAfterDiscount: number;
  //color
  @Prop({
    type: [String], // momken nktbha  Array
  })
  color: string[];
  //category
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Category.name,
    required: true,
  })
  category: string;
  //subCategory
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: SubCategory.name,
  })
  subCategory: string;
  //brand
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Brand.name,
  })
  brand: string;
  //rating average
  @Prop({
    type: Number,
    default: 0,
  })
  ratingAverage: number;
  //rating quantity
  @Prop({
    type: Number,
    default: 0,
  })
  ratingQuantity: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
