import { Test, TestingModule } from '@nestjs/testing';
import { TransController } from './trans.controller';
import { TransService } from './trans.service';

describe('TransController', () => {
  let controller: TransController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransController],
      providers: [TransService],
    }).compile();

    controller = module.get<TransController>(TransController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
