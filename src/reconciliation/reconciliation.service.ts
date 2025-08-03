import { Injectable } from '@nestjs/common';
import { CreateReconciliationDto } from './dto/create-reconciliation.dto';
import { UpdateReconciliationDto } from './dto/update-reconciliation.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ReconciliationReport } from './entities/reconciliation.entity';
import { Model } from 'mongoose';
import { Transaction } from 'src/transactions/entities/transaction.entity';

@Injectable()
export class ReconciliationService {
  constructor(
    @InjectModel(ReconciliationReport.name)
    private readonly reconciliationModel: Model<ReconciliationReport>,
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<Transaction>,
  ) {}
  // reconciliation.service.ts
  async reconcile(uploadedBy: string = 'Admin') {
    const [aTxs, bTxs] = await Promise.all([
      this.transactionModel.find({ sourceSystem: 'A' }).lean(),
      this.transactionModel.find({ sourceSystem: 'B' }).lean(),
    ]);

    const mapA = new Map(aTxs.map((tx) => [tx.transactionId, tx]));
    const mapB = new Map(bTxs.map((tx) => [tx.transactionId, tx]));

    const missingInA: string[] = [];
    const missingInB: string[] = [];
    const amountMismatches: string[] = [];
    const statusMismatches: string[] = [];

    for (const [id, txA] of mapA.entries()) {
      const txB = mapB.get(id);
      if (!txB) {
        missingInB.push(id);
        continue;
      }
      if (txA.amount !== txB.amount) amountMismatches.push(id);
      if (txA.status !== txB.status) statusMismatches.push(id);
    }

    for (const id of mapB.keys()) {
      if (!mapA.has(id)) missingInA.push(id);
    }

    const report = new this.reconciliationModel({
      uploadedBy,
      missingInA,
      missingInB,
      amountMismatches,
      statusMismatches,
    });

    await report.save();
    return report;
  }

  // src/reconciliation/reconciliation.service.ts

  async getReports(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.reconciliationModel
        .find()
        .sort({ createdAt: -1 }) // latest first
        .skip(skip)
        .limit(limit)
        .lean(),
      this.reconciliationModel.countDocuments(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  create(createReconciliationDto: CreateReconciliationDto) {
    return 'This action adds a new reconciliation';
  }

  findAll() {
    return `This action returns all reconciliation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reconciliation`;
  }

  update(id: number, updateReconciliationDto: UpdateReconciliationDto) {
    return `This action updates a #${id} reconciliation`;
  }

  remove(id: number) {
    return `This action removes a #${id} reconciliation`;
  }
}
