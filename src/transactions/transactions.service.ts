import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as csv from 'fast-csv';
import { Transaction } from './entities/transaction.entity';
import { TransactionDocument } from './entities/transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<TransactionDocument>,
  ) {}
  async parseAndStoreCSV(fileBuffer: Buffer, sourceSystem: 'A' | 'B') {
    const stream = csv.parse({ headers: true });
    const transactions: Partial<Transaction>[] = [];

    return new Promise((resolve, reject) => {
      stream.on('data', (row: any) => {
        transactions.push({
          transactionId: row.transactionId,
          timestamp: new Date(row.timestamp),
          amount: row.amount ? parseFloat(row.amount) : undefined,
          //  parseFloat(row.amount),
          currency: row.currency,
          status: row.status,
          sourceSystem,
        });
      });

      stream.on('end', async () => {
        try {
          await this.transactionModel.insertMany(transactions);
          resolve({ message: 'Uploaded and parsed successfully' });
        } catch (err) {
          reject(err);
        }
      });

      stream.on('error', reject);

      stream.write(fileBuffer);
      stream.end();
    });
  }

  async getPaginatedTransactions(source?: 'A' | 'B', page = 1, limit = 20) {
    const query: any = {};
    if (source === 'A' || source === 'B') {
      query.sourceSystem = source;
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.transactionModel
        .find(query)
        .sort({ timestamp: -1 }) // optional: latest first
        .skip(skip)
        .limit(limit)
        .exec(),
      this.transactionModel.countDocuments(query),
    ]);

    return {
      data,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  create(createTransactionDto: CreateTransactionDto) {
    return 'This action adds a new transaction';
  }

  findAll() {
    return `This action returns all transactions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
