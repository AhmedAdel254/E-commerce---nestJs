import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ControllerToFindReview, ReviewController } from './review.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from './review.schema';
import { Product, ProductSchema } from 'src/product/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Review.name, schema: ReviewSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  controllers: [ReviewController, ControllerToFindReview],
  providers: [ReviewService],
})
export class ReviewModule {}
