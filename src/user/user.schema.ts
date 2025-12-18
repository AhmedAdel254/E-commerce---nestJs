import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  //name
  @Prop({
    type: String,
    required: true,
    min: [3, 'Name is too short'],
    max: [20, 'Name is too long'],
  })
  name: string;
  //email
  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  email: string;
  //password
  @Prop({
    type: String,
    required: true,
    min: [3, 'Name is too short'],
    max: [20, 'Name is too long'],
  })
  password: string;
  //role
  @Prop({
    type: String,
    enum: ['admin', 'user'],
  })
  role: string;
  //avatar
  @Prop({
    type: String,
  })
  avatar: string;
  //age
  @Prop({
    type: Number,
  })
  age: number;
  //phone number
  @Prop({
    type: String,
  })
  phoneNumber: string;
  //address
  @Prop({
    type: String,
  })
  address: string;
  //is active
  @Prop({
    type: Boolean,
    enum: [false, true],
  })
  active: boolean;
  //verification code
  @Prop({
    type: String,
  })
  VerificationCode: string;
  //gender
  @Prop({
    type: String,
    enum: ['male', 'female'],
  })
  gender: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
