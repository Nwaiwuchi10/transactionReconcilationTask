import { Test, TestingModule } from '@nestjs/testing';
import { FlaggedTransactionService } from './flagged-transaction.service';

describe('FlaggedTransactionService', () => {
  let service: FlaggedTransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FlaggedTransactionService],
    }).compile();

    service = module.get<FlaggedTransactionService>(FlaggedTransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
