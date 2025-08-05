export class CreateTranDto {}
// src/dto/transaction-pay.dto.ts
import {
  IsString,
  IsNumber,
  IsDateString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class GeoDto {
  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;
}

export class TransactionPayDto {
  @IsString()
  transactionId: string;

  @IsString()
  userId: string;

  @IsNumber()
  amount: number;

  @IsDateString()
  timestamp: string;

  @IsString()
  merchant: string;

  @ValidateNested()
  @Type(() => GeoDto)
  location: GeoDto;
}
