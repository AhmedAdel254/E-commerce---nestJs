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
  UseGuards,
  Req,
  HttpException,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Roles } from 'src/decorator/roles.decorator';
import { AuthGuard } from 'guard/auth.guard';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}
  //only user can create cart
  @Post(':productId')
  @Roles(['user'])
  @UseGuards(AuthGuard)
  create(@Param('productId') productId: string, @Req() req: any) {
    if (req.user.role.toLowerCase() === 'admin') {
      throw new HttpException('Admin can not create request product', 400);
    }
    const user_id: string = req.user._id;
    return this.cartService.create(productId, user_id);
  }

  //apply copoun to cart
  @Post('applyCoupon/:coupon')
  @Roles(['user'])
  @UseGuards(AuthGuard)
  applyCoupon(@Param('coupon') coupon: string, @Req() req) {
    if (req.user.role.toLowerCase() === 'admin') {
      throw new HttpException('Admin can not apply coupon to cart', 400);
    }
    const user_id: string = req.user._id;

    return this.cartService.applyCoupon(coupon, user_id);
  }

  //only user can get his cart
  @Get()
  @Roles(['user'])
  @UseGuards(AuthGuard)
  findOne(@Param() id: string, @Req() req: any) {
    if (req.user.role.toLowerCase() === 'admin') {
      throw new HttpException('Admin can not get request product', 400);
    }
    const user_id: string = req.user._id;
    return this.cartService.findOne(user_id);
  }

  //only user can update cart
  @Patch(':productId')
  @Roles(['user'])
  @UseGuards(AuthGuard)
  update(
    @Param('productId') productId: string,
    @Req() req: any,
    @Body() updateCartDto: UpdateCartDto,
  ) {
    if (req.user.role.toLowerCase() === 'admin') {
      throw new HttpException('Admin can not delete request product', 400);
    }
    const user_id: string = req.user._id;
    return this.cartService.update(productId, user_id, updateCartDto);
  }
  //only user can delete cart

  @Delete(':productId')
  @Roles(['user'])
  @UseGuards(AuthGuard)
  remove(@Param('productId') productId: string, @Req() req: any) {
    if (req.user.role.toLowerCase() === 'admin') {
      throw new HttpException('Admin can not delete request product', 400);
    }
    const user_id: string = req.user._id;

    return this.cartService.remove(productId, user_id);
  }

  //====================== admin ==================//
  //admin can get all carts
  @Get('admin/:userId')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  findOneForAdmin(@Param('userId') userId: string) {
    return this.cartService.findOneForAdmin(userId);
  }

  //admin can get all carts
  @Get('admin')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  findAllForAdmin() {
    return this.cartService.findAllForAdmin();
  }
}
