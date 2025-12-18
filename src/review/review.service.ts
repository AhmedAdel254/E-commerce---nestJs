import { HttpException, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Review } from './review.schema';
import { Model } from 'mongoose';
import { Product } from 'src/product/product.schema';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private ReviewModel: Model<Review>,
    @InjectModel(Product.name) private ProductModel: Model<Product>,
  ) {}
  async create(createReviewDto: CreateReviewDto, userId: string) {
    const review = await this.ReviewModel.findOne({
      product: createReviewDto.product,
      user: userId,
    });
    if (review) {
      throw new HttpException('You have already reviewed this product', 400);
    }
    const createdReview = await (
      await (
        await this.ReviewModel.create({
          ...createReviewDto,
          user: userId,
        })
      ).populate('product', 'title description imageCover')
    ).populate('user', 'name');

    //rating in product module
    const reviews = await this.ReviewModel.find({
      product: createReviewDto.product,
    }).select('rating');
    const ratingQuantity = reviews.length;
    let totalRating = 0;
    for (let i = 0; i < reviews.length; i++) {
      totalRating += reviews[i].rating;
    }
    const ratingAverage = totalRating / ratingQuantity;
    await this.ProductModel.findByIdAndUpdate(createReviewDto.product, {
      ratingAverage: ratingAverage,
      ratingQuantity: ratingQuantity,
    });
    return {
      status: 201,
      message: 'Review created successfully',
      data: createdReview,
    };
  }

  async findAll(product_id: string) {
    const reviews = await this.ReviewModel.find({
      product: product_id,
    }).populate('product user', 'name email title imageCover');
    return {
      status: 200,
      message: 'Reviews retrieved successfully',
      data: reviews,
    };
  }

  async findOne(user_id: string) {
    const reviews = await this.ReviewModel.find({ user: user_id }).populate(
      'product user',
      'name email role title imageCover',
    );
    return {
      status: 200,
      message: 'Reviews retrieved successfully',
      data: reviews,
    };
  }

  async update(id: string, updateReviewDto: UpdateReviewDto, user_id: string) {
    const review = await this.ReviewModel.findById(id);
    if (!review) {
      throw new HttpException('Review not found', 404);
    }
    if (review.user.toString() !== user_id.toString()) {
      throw new HttpException('You can not update this review', 400);
    }
    const updatedReview = await this.ReviewModel.findByIdAndUpdate(
      id,
      {
        ...updateReviewDto,
        user: user_id,
        product: updateReviewDto.product,
      },
      { new: true },
    ).select('-__v');
    //rating in product module
    const reviews = await this.ReviewModel.find({
      product: updateReviewDto.product,
    }).select('rating');
    const ratingQuantity = reviews.length;
    let totalRating = 0;
    for (let i = 0; i < reviews.length; i++) {
      totalRating += reviews[i].rating;
    }
    const ratingAverage = totalRating / ratingQuantity;
    await this.ProductModel.findByIdAndUpdate(updateReviewDto.product, {
      ratingAverage: ratingAverage,
      ratingQuantity: ratingQuantity,
    });
    return {
      status: 200,
      message: 'Review updated successfully',
      data: updatedReview,
    };
  }

  async remove(id: string, user_id: string) {
    const review = await this.ReviewModel.findById(id);
    if (!review) {
      throw new HttpException('Review not found', 404);
    }
    if (review.user.toString() !== user_id.toString()) {
      throw new HttpException('You can not update this review', 400);
    }
    await this.ReviewModel.findByIdAndDelete(id);
    //rating in product module
    const reviews = await this.ReviewModel.find({
      product: review.product,
    }).select('rating');
    const ratingQuantity = reviews.length;
    let totalRating = 0;
    for (let i = 0; i < reviews.length; i++) {
      totalRating += reviews[i].rating;
    }
    const ratingAverage = totalRating / ratingQuantity;
    await this.ProductModel.findByIdAndUpdate(review.product, {
      ratingAverage: ratingAverage,
      ratingQuantity: ratingQuantity,
    });
    return {
      status: 200,
      message: 'Review deleted successfully',
    };
  }
}
