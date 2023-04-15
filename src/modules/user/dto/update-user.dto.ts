import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString, IsOptional } from 'class-validator';

export class UpdateUserDto extends OmitType(PartialType(CreateUserDto), [
  'email',
]) {
  @IsString()
  @IsOptional()
  bio?: string;
}
