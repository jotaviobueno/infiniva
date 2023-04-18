import { IsNumber, Max, Min } from 'class-validator';

export class CreateCartDto {
  @IsNumber()
  @Min(1)
  @Max(99999)
  quantity: number;
}
