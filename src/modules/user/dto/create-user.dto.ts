import {
  IsString,
  IsNotEmpty,
  Length,
  IsEmail,
  IsOptional,
  IsUrl,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  first_name: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  last_name: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 30)
  username: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  avatar_url?: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 72)
  password: string;
}
