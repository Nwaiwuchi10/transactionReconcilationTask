import { Test, TestingModule } from '@nestjs/testing';
import { TransService } from './trans.service';

describe('TransService', () => {
  let service: TransService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransService],
    }).compile();

    service = module.get<TransService>(TransService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
