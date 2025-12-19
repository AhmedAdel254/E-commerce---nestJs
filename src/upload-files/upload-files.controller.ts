/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CloudinaryService } from './upload-files.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/decorator/roles.decorator';
import { AuthGuard } from 'guard/auth.guard';

@Controller('image')
export class UploadFilesController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  //single file upload
  @Post('upload')
  @Roles(['admin', 'user'])
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000000 }),
          new FileTypeValidator({ fileType: 'image/png' }),
        ],
      }),
    )
    file: any,
  ) {
    return this.cloudinaryService.uploadFile(file);
  }
  // multiple file upload
  @Post('uploads')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('file[]', 5))
  uploadImages(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000000 }),
          new FileTypeValidator({ fileType: 'image/png' }),
        ],
      }),
    )
    files: any,
  ) {
    return this.cloudinaryService.uploadFiles(files);
  }
}
