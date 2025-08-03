import {
  IsString,
  IsNotEmpty,
  IsIn,
  IsNumber,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  @IsOptional()
  transactionId: string;

  @IsIn(['A', 'B'])
  sourceSystem: 'A' | 'B';

  @IsDateString()
  timestamp: string; // string format to be parsed as a Date

  @IsNumber()
  amount: number;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsIn(['SUCCESS', 'FAILED'])
  status: 'SUCCESS' | 'FAILED';
}
