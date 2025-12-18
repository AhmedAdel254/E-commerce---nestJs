/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { newPassDTO, verifyDTO } from './DTO/auth.dto';

const saltOrRounds = 10;
@Injectable()
export class AuthService {
  [x: string]: any;
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private readonly mailService: MailerService,
  ) {}

  async signUp(authDTO: any) {
    const user = await this.userModel.findOne({ email: authDTO.email });
    if (user) {
      throw new HttpException('User already exist', 400);
    }
    const passwordHash = await bcrypt.hash(authDTO.password, saltOrRounds);
    authDTO.password = passwordHash;
    const newUser = {
      role: 'user',
      active: true,
    };

    const userCreated = await this.userModel.create({ ...authDTO, ...newUser }); //create user

    const payload = {
      _id: userCreated._id,
      email: userCreated.email,
      role: userCreated.role,
    };

    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_Secret,
    }); //create token
    return {
      status: 200,
      message: 'User created successfully',
      data: userCreated,
      access_token: token,
    };
  }

  async signIn(signInDTO: any) {
    const user = await this.userModel.findOne({ email: signInDTO.email });
    if (!user) {
      throw new HttpException('Invalid credentials', 400);
    }
    const isMatch = await bcrypt.compare(signInDTO.password, user.password);
    if (!isMatch) {
      throw new HttpException('Invalid credentials', 400);
    }
    const payload = {
      _id: user._id,
      email: user.email,
      role: user.role,
    };
    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_Secret,
    });
    return {
      status: 200,
      message: 'User logged in successfully',
      data: user,
      access_token: token,
    };
  }

  async resetpass(email: any) {
    const user = await this.userModel.findOne(email);
    if (!user) {
      throw new HttpException('User not found', 400);
    }
    //create code form 6 digits
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    //send code to varification email
    await this.userModel.findOneAndUpdate(email, {
      VerificationCode: code,
    });
    //send code to email
    const message = `Your password reset code is: ${code}`;
    this.mailService.sendMail({
      from: 'E-commerseProject-nestJS <ahmedpp0941@gmail.com>',
      to: user.email,
      subject: `E-commerseProject-nestJS reset password code`,
      text: message,
    });
    return {
      status: 200,
      message: 'Verification code sent to email',
    };
  }

  async verify(verifyCode: verifyDTO) {
    const user = await this.userModel
      .findOne({ email: verifyCode.email })
      .select('VerificationCode');
    if (!user) {
      throw new HttpException('User not found', 400);
    }
    if (user.VerificationCode !== verifyCode.code) {
      throw new HttpException('Invalid code', 400);
    }
    await this.userModel.findOneAndUpdate(
      { email: verifyCode.email },
      {
        VerificationCode: null,
      },
    );
    return {
      status: 200,
      message: 'Code verified successfully',
    };
  }
  async newpass(newPass: newPassDTO) {
    const user = await this.userModel.findOne({ email: newPass.email });
    if (!user) {
      throw new HttpException('User not found', 400);
    }
    const passwordHash = await bcrypt.hash(newPass.password, saltOrRounds);
    await this.userModel.findOneAndUpdate(
      { email: newPass.email },
      {
        password: passwordHash,
      },
    );
    return {
      status: 200,
      message: 'Password changed successfully',
    };
  }
}
