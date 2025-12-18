import { Module } from '@nestjs/common';
import { TexService } from './Tax.service';
import { TexController } from './Tax.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tax, TaxSchema } from './Tax.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Tax.name,
        schema: TaxSchema,
      },
    ]),
  ],
  controllers: [TexController],
  providers: [TexService],
})
export class TaxModule {}
