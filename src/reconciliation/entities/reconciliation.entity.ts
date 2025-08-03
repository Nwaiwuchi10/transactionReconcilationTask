import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ReconciliationDocument = ReconciliationReport & Document;

@Schema({ timestamps: true })
export class ReconciliationReport {
  @Prop({ type: String, default: 'Admin' })
  uploadedBy: string;

  @Prop({ type: [String] })
  missingInA: string[];

  @Prop({ type: [String] })
  missingInB: string[];

  @Prop({ type: [String] })
  amountMismatches: string[];

  @Prop({ type: [String] })
  statusMismatches: string[];
}

export const ReconciliationSchema =
  SchemaFactory.createForClass(ReconciliationReport);
