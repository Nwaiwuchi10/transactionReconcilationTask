import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateReconciliationDto {
  @IsOptional()
  @IsString()
  uploadedBy?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  missingInA?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  missingInB?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amountMismatches?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  statusMismatches?: string[];
}
