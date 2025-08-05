import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Geo {
  @Prop({ required: true })
  lat: number;

  @Prop({ required: true })
  lng: number;
}
@Schema({ timestamps: true })
export class FlaggedTransaction extends Document {
  @Prop({ required: true })
  transactionId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  reason: string; // e.g., "high-frequency", "high-amount", "location-change"

  @Prop({ required: true })
  timestamp: Date;

  @Prop({ required: true })
  location: Geo;
}

export const FlaggedTransactionSchema =
  SchemaFactory.createForClass(FlaggedTransaction);
