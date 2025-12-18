/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, newPassDTO, resetDTO, SignInDto, verifyDTO } from './DTO/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //signUp
  @Post('sign-Up')
  signUp(@Body() authDTO: AuthDto) {
    return this.authService.signUp(authDTO);
  }
  //signIn
  @Post('sign-In')
  signIn(@Body() signInDTO: SignInDto) {
    return this.authService.signIn(signInDTO);
  }

  //reset password
  @Post('reset-password')
  resetPassword(@Body() resetDto: resetDTO) {
    return this.authService.resetpass(resetDto);
  }
  //verify code
  @Post('verify-code')
  verifyCode(@Body() verifyCode:verifyDTO) {
    return this.authService.verify(verifyCode);
  }

  //new password
  @Post('new-password')
  newPassword(@Body() newPass:newPassDTO) {
    return this.authService.newpass(newPass);
  }


}
