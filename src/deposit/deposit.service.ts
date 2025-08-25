import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ApproveDepositDto, CreateDepositDto } from './dto/create-deposit.dto';
import { UpdateDepositDto } from './dto/update-deposit.dto';
import { Deposit } from './entities/deposit.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Tradingaccount } from 'src/tradingaccount/entities/tradingaccount.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class DepositService {
  constructor(
    @InjectModel(Deposit.name) private depositModel: Model<Deposit>,
    @InjectModel(Tradingaccount.name)
    private tradingAccountModel: Model<Tradingaccount>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async create(createDepositDto: CreateDepositDto): Promise<Deposit> {
    if (!createDepositDto.havePaid === true) {
      throw new BadRequestException(
        'Deposit cannot be created unless i have Paid is true',
      );
    }
    const deposit = new this.depositModel(createDepositDto);
    return deposit.save();
  }

  async findAll(): Promise<Deposit[]> {
    return this.depositModel
      .find()
      .sort({ createdAt: -1 })
      .populate('adminWalletId clientId')
      .exec();
  }

  async findOne(id: string): Promise<Deposit> {
    const deposit = await this.depositModel
      .findById(id)
      .populate('adminWalletId clientId')
      .exec();
    if (!deposit) throw new NotFoundException('Deposit not found');
    return deposit;
  }

  async update(
    id: string,
    updateDepositDto: UpdateDepositDto,
  ): Promise<Deposit> {
    const deposit = await this.depositModel
      .findByIdAndUpdate(id, { $set: updateDepositDto }, { new: true })
      .exec();
    if (!deposit) throw new NotFoundException('Deposit not found');
    return deposit;
  }

  async approveDeposit(depositId: string) {
    // 1. Find deposit
    const deposit = await this.depositModel.findById(depositId);
    if (!deposit) {
      throw new NotFoundException('Deposit not found');
    }

    // 2. Approve deposit
    deposit.approvePayment = true;
    deposit.depositStatus = 'Approved';
    await deposit.save();

    // 3. Update/Create Trading Account for the depositor
    let tradingAcc = await this.tradingAccountModel.findOne({
      clientId: deposit.clientId,
    });

    if (!tradingAcc) {
      tradingAcc = new this.tradingAccountModel({
        clientId: deposit.clientId,
        availableBalance: deposit.amount,
        totalBalance: deposit.amount,
      });
    } else {
      tradingAcc.availableBalance += deposit.amount;
      tradingAcc.totalBalance += deposit.amount;
    }

    await tradingAcc.save();

    // 4. Handle referral bonus if user was referred
    const user = await this.userModel.findById(deposit.clientId);

    if (user && user.referredBy) {
      const referrer = await this.userModel.findOne({
        referralCode: user.referredBy,
      });

      if (referrer) {
        // Update referral balance
        referrer.referralBalance = (referrer.referralBalance || 0) + 5;
        await referrer.save();

        // Update/Create Trading Account for referrer
        let refTradingAcc = await this.tradingAccountModel.findOne({
          clientId: referrer._id,
        });

        if (!refTradingAcc) {
          refTradingAcc = new this.tradingAccountModel({
            clientId: referrer._id,
            availableBalance: 5,
            totalBalance: 5,
          });
        } else {
          refTradingAcc.availableBalance += 5;
          refTradingAcc.totalBalance += 5;
        }

        await refTradingAcc.save();
      }
    }

    // 5. Final response
    return {
      message: 'Deposit approved & Trading account updated',
      tradingAccount: tradingAcc,
    };
  }

  async approveDepositFun(depositId: string, adminId: string) {
    const deposit = await this.depositModel.findById(depositId);
    if (!deposit) throw new NotFoundException('Deposit not found');

    deposit.approvePayment = true;
    deposit.depositStatus = 'Approved';
    await deposit.save();

    // Check if Trading Account exists
    let tradingAcc = await this.tradingAccountModel.findOne({
      clientId: deposit.clientId,
    });

    if (!tradingAcc) {
      tradingAcc = new this.tradingAccountModel({
        clientId: deposit.clientId,
        availableBalance: deposit.amount,
        totalBalance: deposit.amount,
      });
    } else {
      tradingAcc.totalBalance += deposit.amount;
      tradingAcc.availableBalance += deposit.amount;
    }

    await tradingAcc.save();

    return {
      message: 'Deposit approved & Trading account updated',
      tradingAcc,
    };
  }
  async approve(id: string, approveDto: ApproveDepositDto): Promise<Deposit> {
    const deposit = await this.depositModel.findById(id).exec();
    if (!deposit) throw new NotFoundException('Deposit not found');

    deposit.approvePayment = approveDto.approvePayment;
    return deposit.save();
  }

  async approveDeposity(id: string) {
    const deposit = await this.depositModel.findById(id);
    if (!deposit) {
      throw new NotFoundException('Deposit not found');
    }

    // Update fields
    deposit.approvePayment = true;
    deposit.depositStatus = 'Approved';

    await deposit.save();

    return {
      message: 'Deposit approved successfully',
      deposit,
    };
  }

  async remove(id: string): Promise<void> {
    const result = await this.depositModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Deposit not found');
  }
}
