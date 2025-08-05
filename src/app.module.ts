import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionsModule } from './transactions/transactions.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ReconciliationModule } from './reconciliation/reconciliation.module';
import { MusicModule } from './music/music.module';
import { TransModule } from './trans/trans.module';
import { FlaggedTransactionModule } from './flagged-transaction/flagged-transaction.module';
import config from './config/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [config],
    }),
    MongooseModule.forRoot(process.env.MONGO_URI || ''),
    TransactionsModule,
    ReconciliationModule,
    MusicModule,
    TransModule,
    FlaggedTransactionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
