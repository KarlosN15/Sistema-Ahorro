import { IsNumber, IsString, IsOptional, IsDateString, IsInt } from 'class-validator';

export class CreateIncomeDto {
  @IsNumber()
  amount: number;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  clientName?: string;

  @IsInt()
  @IsOptional()
  serviceId?: number;
}
