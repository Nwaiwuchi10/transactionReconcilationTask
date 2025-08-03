// src/schemas/transaction.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TransactionDocument = Transaction & Document;

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ required: true })
  transactionId: string;

  @Prop({ required: true })
  sourceSystem: 'A' | 'B'; // SourceSystemA or B

  @Prop({ required: true })
  timestamp: Date;

  @Prop({ required: false })
  amount: number;

  @Prop({ required: true })
  currency: string;

  @Prop({ required: false })
  status: 'SUCCESS' | 'FAILED';
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
