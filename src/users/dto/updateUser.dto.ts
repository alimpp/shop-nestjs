import { PartialType } from '@nestjs/mapped-types';
import { CreateDto } from './createUser.dto';

export class UpdateUserDto extends PartialType(CreateDto) {}
