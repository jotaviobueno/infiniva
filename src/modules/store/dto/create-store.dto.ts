import {
  IsNotEmpty,
  IsString,
  Length,
  IsUrl,
  IsOptional,
} from 'class-validator';

export class CreateStoreDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 2000)
  description: string;

  @IsUrl()
  @IsOptional()
  image_url?: string;
}
