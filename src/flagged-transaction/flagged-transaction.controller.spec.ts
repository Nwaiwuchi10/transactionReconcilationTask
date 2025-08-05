import { Test, TestingModule } from '@nestjs/testing';
import { FlaggedTransactionController } from './flagged-transaction.controller';
import { FlaggedTransactionService } from './flagged-transaction.service';

describe('FlaggedTransactionController', () => {
  let controller: FlaggedTransactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlaggedTransactionController],
      providers: [FlaggedTransactionService],
    }).compile();

    controller = module.get<FlaggedTransactionController>(FlaggedTransactionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
