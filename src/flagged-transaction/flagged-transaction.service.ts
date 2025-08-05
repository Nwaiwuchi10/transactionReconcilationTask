import { Injectable } from '@nestjs/common';
import { CreateFlaggedTransactionDto } from './dto/create-flagged-transaction.dto';
import { UpdateFlaggedTransactionDto } from './dto/update-flagged-transaction.dto';

@Injectable()
export class FlaggedTransactionService {
  create(createFlaggedTransactionDto: CreateFlaggedTransactionDto) {
    return 'This action adds a new flaggedTransaction';
  }

  findAll() {
    return `This action returns all flaggedTransaction`;
  }

  findOne(id: number) {
    return `This action returns a #${id} flaggedTransaction`;
  }

  update(id: number, updateFlaggedTransactionDto: UpdateFlaggedTransactionDto) {
    return `This action updates a #${id} flaggedTransaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} flaggedTransaction`;
  }
}
