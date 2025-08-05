import { Module } from '@nestjs/common';
import { TransService } from './trans.service';
import { TransController } from './trans.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionPay, TransactionPaySchema } from './entities/tran.entity';
import {
  FlaggedTransaction,
  FlaggedTransactionSchema,
} from 'src/flagged-transaction/entities/flagged-transaction.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TransactionPay.name,
        schema: TransactionPaySchema,
      },
      {
        name: FlaggedTransaction.name,
        schema: FlaggedTransactionSchema,
      },
    ]),
  ],
  controllers: [TransController],
  providers: [TransService],
})
export class TransModule {}
