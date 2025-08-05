import { Injectable } from '@nestjs/common';
import { CreateTranDto } from './dto/create-tran.dto';
import { UpdateTranDto } from './dto/update-tran.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Geo, TransactionPay } from './entities/tran.entity';
import { Model } from 'mongoose';
import { FlaggedTransaction } from 'src/flagged-transaction/entities/flagged-transaction.entity';
@Injectable()
export class TransService {
  private userTxQueue = new Map<string, TransactionPay[]>();
  private dailyAmountMap = new Map<string, number>();
  private recentLocations = new Map<
    string,
    { timestamp: Date; location: Geo }
  >();

  constructor(
    @InjectModel(TransactionPay.name)
    private readonly transactionModel: Model<TransactionPay>,
    @InjectModel(FlaggedTransaction.name)
    private readonly flaggedTransactionModel: Model<FlaggedTransaction>,
  ) {}
  async processTransaction(tx: TransactionPay) {
    const reasons: string[] = [];

    // HIGH-FREQUENCY DETECTION: more than 5 in the past 1 minute
    const oneMinuteAgo = new Date(tx.timestamp.getTime() - 60 * 1000);
    const recentTxs = await this.transactionModel.countDocuments({
      userId: tx.userId,
      timestamp: { $gt: oneMinuteAgo, $lte: tx.timestamp },
    });

    if (recentTxs >= 5) {
      reasons.push('high-frequency');
    }

    // HIGH-AMOUNT DETECTION: total amount for today > $10,000
    const dayStart = new Date(tx.timestamp);
    dayStart.setUTCHours(0, 0, 0, 0);
    const dayEnd = new Date(tx.timestamp);
    dayEnd.setUTCHours(23, 59, 59, 999);

    const dailyTransactions = await this.transactionModel.aggregate([
      {
        $match: {
          userId: tx.userId,
          timestamp: { $gte: dayStart, $lte: dayEnd },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
        },
      },
    ]);

    const totalAmount = (dailyTransactions[0]?.totalAmount || 0) + tx.amount;

    if (totalAmount > 10000) {
      reasons.push('high-amount');
    }

    // LOCATION CHANGE DETECTION: if location changes by >10km in under 2 minutes
    const lastTx = await this.transactionModel
      .findOne({
        userId: tx.userId,
      })
      .sort({ timestamp: -1 });

    if (lastTx) {
      const timeDiff = Math.abs(
        tx.timestamp.getTime() - new Date(lastTx.timestamp).getTime(),
      );

      const isFar = this.calculateDistance(tx.location, lastTx.location) > 10;
      if (timeDiff < 2 * 60 * 1000 && isFar) {
        reasons.push('location-change');
      }
    }

    // Save transaction
    await this.transactionModel.create(tx);

    // Save flagged if needed
    if (reasons.length > 0) {
      await this.flaggedTransactionModel.create({
        transactionId: tx.transactionId,
        userId: tx.userId,
        reason: reasons.join(','),
        timestamp: tx.timestamp,
        location: tx.location,
      });
    }
  }
  private calculateDistance(loc1: Geo, loc2: Geo): number {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371; // Earth's radius in km

    const dLat = toRad(loc2.lat - loc1.lat);
    const dLng = toRad(loc2.lng - loc1.lng);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(loc1.lat)) *
        Math.cos(toRad(loc2.lat)) *
        Math.sin(dLng / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // distance in km
  }

  async getFlaggedTransactionsByUser(userId: string) {
    return await this.flaggedTransactionModel
      .find({ userId })
      .sort({ timestamp: -1 })
      .lean();
  }
  create(createTranDto: CreateTranDto) {
    return 'This action adds a new tran';
  }

  findAll() {
    return `This action returns all trans`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tran`;
  }

  update(id: number, updateTranDto: UpdateTranDto) {
    return `This action updates a #${id} tran`;
  }

  remove(id: number) {
    return `This action removes a #${id} tran`;
  }
}
