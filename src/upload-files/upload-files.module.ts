import { Module } from '@nestjs/common';
import { CloudinaryService } from './upload-files.service';
import { UploadFilesController } from './upload-files.controller';

@Module({
  controllers: [UploadFilesController],
  providers: [CloudinaryService],
  exports: [CloudinaryService],
})
export class UploadFilesModule {}
