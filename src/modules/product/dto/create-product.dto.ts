import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 2000)
  description: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  @Length(1, 20, {
    each: true,
  })
  categories: string[];

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(7)
  images_url: string[];

  @IsNumber()
  @IsNotEmpty()
  weight: number;

  @IsNumber()
  @Min(1)
  @Max(99999)
  @IsNotEmpty()
  stock: number;

  @IsNumber()
  @Min(1)
  @Max(9999999)
  @IsNotEmpty()
  value: number;
}
