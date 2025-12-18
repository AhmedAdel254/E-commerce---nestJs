import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SuppliersDocument = HydratedDocument<Suppliers>;

@Schema({ timestamps: true })
export class Suppliers {
  //name
  @Prop({
    type: String,
    required: true,
    min: [3, 'Name is too short'],
    max: [100, 'Name is too long'],
  })
  name: string;
  //website
  @Prop({
    type: String,
    required: true,
  })
  website: string;
}

export const SuppliersSchema = SchemaFactory.createForClass(Suppliers);
