import { Controller, Get, Post, Body, Delete, UseGuards } from '@nestjs/common';
import { TexService } from './Tax.service';
import { CreateTexDto } from './dto/create-Tax.dto';
import { Roles } from 'src/decorator/roles.decorator';
import { AuthGuard } from 'guard/auth.guard';

@Controller('Tax')
export class TexController {
  constructor(private readonly texService: TexService) {}

  @Post()
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  create(@Body() createTexDto: CreateTexDto) {
    return this.texService.createOrUpdate(createTexDto);
  }

  @Get()
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  find() {
    return this.texService.find();
  }

  @Delete()
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  remove() {
    return this.texService.reSet();
  }
}
