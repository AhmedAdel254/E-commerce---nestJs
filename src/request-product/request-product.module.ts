import { Module } from '@nestjs/common';
import { RequestProductService } from './request-product.service';
import { RequestProductController } from './request-product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RequestProducts,
  RequestProductsSchema,
} from './request-product.schema';
import { User, UserSchema } from 'src/user/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RequestProducts.name, schema: RequestProductsSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [RequestProductController],
  providers: [RequestProductService],
})
export class RequestProductModule {}
