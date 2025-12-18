import { PartialType } from '@nestjs/mapped-types';
import { CreateTexDto } from './create-Tax.dto';

export class UpdateTexDto extends PartialType(CreateTexDto) {}
