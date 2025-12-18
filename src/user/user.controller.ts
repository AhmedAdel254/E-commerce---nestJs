/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'guard/auth.guard';
import { Roles } from 'src/decorator/roles.decorator';

//admin can manage users
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  //for admin only
  // admin can create user
  @Post()
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  create(@Body() createUserDto: CreateUserDto, @Req() req) {
    return this.userService.create(createUserDto);
  }
  //admin can see all users
  @Get()
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  findAll(@Query() query) {
    return this.userService.findAll(query);
  }
  // admin can see single user
  @Get(':id')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
  // admin can update user
  @Patch(':id')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  // admin can delete user
  @Delete(':id')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}

//user can see his profile
@Controller('profile')
export class UserProfileController {
  constructor(private readonly userService: UserService) {}
  // user can see his profile
  @Get()
  @Roles(['admin', 'user'])
  @UseGuards(AuthGuard)
  getProfile(@Req() req) {
    return this.userService.getProfile(req.user._id);
  }

  // user can update his profile
  @Patch()
  @Roles(['admin', 'user'])
  @UseGuards(AuthGuard)
  updateProfile(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateProfile(req.user._id, updateUserDto);
  }

  // user can delete his profile
  @Delete()
  @Roles(['admin', 'user'])
  @UseGuards(AuthGuard)
  removeProfile(@Req() req) {
    return this.userService.removeProfile(req.user._id);
  }
}
