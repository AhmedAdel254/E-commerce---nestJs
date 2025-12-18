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
  UseGuards,
  Req,
  HttpException,
  Query,
  Headers,
  RawBodyRequest,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthGuard } from 'guard/auth.guard';
import { Roles } from 'src/decorator/roles.decorator';
import type { Request } from 'express';
@Controller('cart/checkout')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @Post(':paymentMethod')
  @Roles(['user'])
  @UseGuards(AuthGuard)
  create(
    @Body() createOrderDto: CreateOrderDto,
    @Req() req,
    @Param('paymentMethod') paymentMethod: 'cash' | 'card',
    @Query() query,
  ) {
    if (!['cash', 'card'].includes(paymentMethod.toLowerCase())) {
      throw new HttpException('Invalid payment method', 400);
    }
    if (req.user.role.toLowerCase() === 'admin') {
      throw new HttpException('Admin can not create request product', 400);
    }
    // 3shan lw elfront 7ab yeb3at success wla cancel url fel query params
    //wlw ma b3atsh yestakhdem el default values
    const {
      success_url = 'http://ecommerce-nestjs',
      cancel_url = 'http://ecommerce-nestjs',
    } = query;
    const dataAfterPayment = { success_url, cancel_url };

    const user_id = req.user._id;

    return this.orderService.create(
      user_id,
      paymentMethod,
      createOrderDto,
      dataAfterPayment,
    );
  }

  @Patch(':orderId/cash')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  update(
    @Param('orderId') orderId: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.orderService.updatePaidCash(orderId, updateOrderDto);
  }
}

// webhook for stripe to update the order status to paid
@Controller('v1/checkout/session')
export class CheckoutCardController {
  constructor(private readonly orderService: OrderService) {}

  // Webhook paid order true auto
  @Post()
  updatePaidCard(
    @Headers('stripe-signature') sig,
    @Req() request: RawBodyRequest<Request>,
  ) {
    const endpointSecret =
      'whsec_db59966519a65529ae568ade70303bf419be37a47f3777c18a8a4f1c79c8a07a';

    const payload = request.rawBody;

    return this.orderService.updatePaidCard(payload, sig, endpointSecret);
  }
}
// get order (عشان مش هتبق علي نفس endpoint بتاعة الكرييت))
@Controller('order')
export class OrderControllerGet {
  constructor(private readonly orderService: OrderService) {}

  //only user can get his order by id
  @Get(':orderId')
  @Roles(['user'])
  @UseGuards(AuthGuard)
  findOne(@Req() req) {
    if (req.user.role.toLowerCase() === 'admin') {
      throw new HttpException('Admin can not get order', 400);
    }
    const userId = req.user._id;
    return this.orderService.findOne(userId);
  }
}
