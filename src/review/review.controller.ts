/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Roles } from 'src/decorator/roles.decorator';
import { AuthGuard } from 'guard/auth.guard';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}
  //user only can create review
  @Post()
  @Roles(['user'])
  @UseGuards(AuthGuard)
  create(@Body() createReviewDto: CreateReviewDto, @Req() req) {
    const user_id = req.user._id;
    if (req.user.role.toLowerCase() === 'admin') {
      throw new HttpException('Admin can not create request product', 400);
    }
    return this.reviewService.create(createReviewDto, user_id);
  }
  //get all reviews of a product
  @Get(':id')
  findAll(@Param('id') product_id: string) {
    return this.reviewService.findAll(product_id);
  }

  // user only can update review
  @Patch(':id')
  @Roles(['user'])
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @Req() req,
  ) {
    const user_id = req.user._id;
    if (req.user.role.toLowerCase() === 'admin') {
      throw new HttpException('Admin can not create request product', 400);
    }
    return this.reviewService.update(id, updateReviewDto, user_id);
  }
  // user only can update review
  @Delete(':id')
  @Roles(['user'])
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @Req() req) {
    if (req.user.role.toLowerCase() === 'admin') {
      throw new HttpException('Admin can not create request product', 400);
    }
    const user_id = req.user._id;
    console.log(user_id);
    return this.reviewService.remove(id, user_id);
  }
}

@Controller('dashBoard/review')
export class ControllerToFindReview {
  constructor(private readonly reviewService: ReviewService) {}

  //get all review of a user (admin can get all review)
  @Get(':id')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  findOne(@Param('id') user_id: string) {
    return this.reviewService.findOne(user_id);
  }
}
