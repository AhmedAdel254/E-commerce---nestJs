import { HttpException, Injectable } from '@nestjs/common';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './cart.schema';
import { Model } from 'mongoose';
import { Product } from 'src/product/product.schema';
import { Coupon } from 'src/coupon/coupon.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private CartModel: Model<Cart>,
    @InjectModel(Product.name) private ProductModel: Model<Product>,
    @InjectModel(Coupon.name) private CouponModel: Model<Coupon>,
  ) {}
  async create(product_Id: string, userId: string) {
    const findCart = await this.CartModel.findOne({ user: userId }).populate(
      'cartItems.productId',
      '_id price priceAfterDiscount',
    );
    if (findCart) {
      let findProduct = findCart.cartItems.find(
        (item) => item.productId._id.toString() === product_Id.toString(),
      );

      if (findProduct) {
        // لو المنتج موجود نزود كمية فقط
        findProduct.quantity += 1;
      } else {
        // لو منتج جديد نضيفه ونحدّث findProduct بالإضافة الجديدة
        findCart.cartItems.push({
          productId: { _id: product_Id },
          quantity: 1,
          color: '',
        });
        //  عشان الحساب بعد كده يبقى مظبوط
        findProduct = findCart.cartItems[findCart.cartItems.length - 1];
      }
      // نجيب سعر المنتج
      const product =
        await this.ProductModel.findById(product_Id).select('price');
      if (!product) {
        throw new HttpException('Product not found', 404);
      }
      //total price update
      let newTotal = 0;
      for (const item of findCart.cartItems) {
        const itemProduct = await this.ProductModel.findById(item.productId);
        if (itemProduct) {
          newTotal +=
            itemProduct.price * item.quantity -
            itemProduct.priceAfterDiscount * item.quantity;
        }
      }

      findCart.totalPrice = newTotal;

      await findCart.save();

      return {
        status: 200,
        message: 'Cart updated successfully',
        data: findCart,
      };
    } else {
      const product = await this.ProductModel.findById(product_Id);
      if (!product) {
        throw new HttpException('Product not found', 404);
      }
      if (product.quantity <= 1) {
        throw new HttpException('Product is out of stock', 400);
      }
      const newCart = await this.CartModel.create({
        cartItems: [
          {
            productId: { _id: product_Id },
            quantity: 1,
          },
        ],
        totalPrice: product.price - product.priceAfterDiscount,
        user: userId,
      });
      return {
        status: 200,
        message: 'Cart created successfully',
        data: newCart,
      };
    }
  }

  async applyCoupon(couponName: string, userId: string) {
    const cart = await this.CartModel.findOne({ user: userId });
    if (!cart) {
      throw new HttpException('Cart not found', 404);
    }
    const coupon = await this.CouponModel.findOne({ name: couponName });
    if (!coupon) {
      throw new HttpException('invalid coupon', 404);
    }
    const isExpired = new Date(coupon.expiryDate) > new Date();
    if (!isExpired) {
      throw new HttpException('Coupon has expired', 400);
    }
    // check if coupon is already applied (استخدمته قبل كدا ولا لا)
    const ifCouponAlreadyApplied = cart.coupon.find(
      (item) => item.name === coupon.name,
    );
    if (ifCouponAlreadyApplied) {
      throw new HttpException('Coupon already applied to cart', 400);
    }
    const discountAmount = (cart.totalPrice * coupon.discount) / 100;
    cart.totalPriceAfterDiscount = cart.totalPrice - discountAmount;
    cart.coupon.push({ name: coupon.name, couponId: coupon._id.toString() });
    await cart.save();
    return {
      status: 200,
      message: 'Coupon applied successfully',
      data: cart,
    };
  }

  async findOne(user_id: string) {
    const cart = await this.CartModel.findOne({ user: user_id });
    if (!cart) {
      throw new HttpException('Cart not found', 404);
    }
    return {
      status: 200,
      message: 'Cart fetched successfully',
      data: cart,
    };
  }

  async update(
    product_Id: string,
    userId: string,
    updateCartDto: UpdateCartDto,
  ) {
    const cart = await this.CartModel.findOne({ user: userId }).populate(
      'cartItems.productId',
      'price priceAfterDiscount quantity',
    );
    const product = await this.ProductModel.findById(product_Id);
    if (!cart) {
      throw new HttpException('Cart not found', 404);
    }
    if (!product) {
      throw new HttpException('Product not found', 404);
    }
    // Logic to update the cart goes here
    const findProduct = cart.cartItems.find(
      (item) => item.productId._id.toString() === product_Id.toString(),
    );
    if (!findProduct) {
      throw new HttpException('Product not found in cart', 404);
    }
    if (findProduct.quantity > product.quantity) {
      throw new HttpException('Product is out of stock', 400);
    }
    findProduct.quantity = updateCartDto.quantity ?? findProduct.quantity;
    //total price update
    let newTotal = 0;
    for (const item of cart.cartItems) {
      const itemProduct = await this.ProductModel.findById(item.productId);
      if (!itemProduct) {
        throw new HttpException('Product not found', 404);
      }
      newTotal +=
        itemProduct.price * item.quantity -
        itemProduct.priceAfterDiscount -
        item.quantity;
    }
    cart.totalPrice = newTotal;

    await cart.save();
    return {
      status: 200,
      message: 'Cart updated successfully',
      data: cart,
    };
  }

  async remove(product_Id: string, userId: string) {
    const cart = await this.CartModel.findOne({ user: userId });
    if (!cart) {
      throw new HttpException('Cart not found', 404);
    }
    const removeCart = await this.CartModel.findOneAndUpdate(
      { user: userId },
      { $pull: { cartItems: { productId: product_Id } } },
      { new: true },
    );
    let newTotal = 0;
    for (const item of cart.cartItems) {
      const itemProduct = await this.ProductModel.findById(item.productId);
      if (!itemProduct) {
        throw new HttpException('Product not found', 404);
      }
      newTotal +=
        itemProduct.price * item.quantity -
        itemProduct.priceAfterDiscount -
        item.quantity;
    }
    cart.totalPrice = newTotal;
    await cart.save();
    return {
      status: 200,
      message: 'Cart item removed successfully',
      data: removeCart,
    };
  }

  async findOneForAdmin(userId: string) {
    const carts = await this.CartModel.findOne({ user: userId }).populate(
      'cartItems.productId',
      'name price priceAfterDiscount',
    );
    if (!carts) {
      throw new HttpException('Carts not found', 404);
    }
    return {
      status: 200,
      message: 'Carts fetched successfully',
      data: carts,
    };
  }

  async findAllForAdmin() {
    const carts = await this.CartModel.find().populate(
      'cartItems.productId user coupon',
      'name price priceAfterDiscount email name couponId',
    );
    return {
      status: 200,
      message: 'All Carts fetched successfully',
      data: carts,
    };
  }
}
