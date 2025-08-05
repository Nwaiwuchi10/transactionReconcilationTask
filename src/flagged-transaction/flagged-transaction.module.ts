import { Module } from '@nestjs/common';
import { FlaggedTransactionService } from './flagged-transaction.service';
import { FlaggedTransactionController } from './flagged-transaction.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TransactionPay,
  TransactionPaySchema,
} from 'src/trans/entities/tran.entity';
import {
  FlaggedTransaction,
  FlaggedTransactionSchema,
} from './entities/flagged-transaction.entity';

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
  controllers: [FlaggedTransactionController],
  providers: [FlaggedTransactionService],
})
export class FlaggedTransactionModule {}
