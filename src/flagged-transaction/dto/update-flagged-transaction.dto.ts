import { PartialType } from '@nestjs/mapped-types';
import { CreateFlaggedTransactionDto } from './create-flagged-transaction.dto';

export class UpdateFlaggedTransactionDto extends PartialType(CreateFlaggedTransactionDto) {}
