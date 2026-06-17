import { IsNumber, IsString, IsOptional, IsDateString, IsInt } from 'class-validator';

export class CreateExpenseDto {
  @IsNumber()
  amount: number;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  categoryId: number;
}
