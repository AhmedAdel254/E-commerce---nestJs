import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BrandDocument = HydratedDocument<Brand>;

@Schema({ timestamps: true })
export class Brand {
  //name
  @Prop({
    type: String,
    required: true,
    min: [3, 'Name is too short'],
    max: [100, 'Name is too long'],
  })
  name: string;
  //image
  @Prop({
    type: String,
  })
  image: string;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);
