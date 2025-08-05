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
export class TransactionPay extends Document {
  @Prop({ required: true })
  transactionId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  timestamp: Date;

  @Prop({ required: true })
  merchant: string;

  @Prop({ required: true })
  location: Geo;

  @Prop({ default: [] })
  fraudReasons: string[];
}

export const TransactionPaySchema =
  SchemaFactory.createForClass(TransactionPay);
