import { Test, TestingModule } from '@nestjs/testing';
import { CollateralsService } from './collaterals.service';

describe('CollateralsService', () => {
  let service: CollateralsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CollateralsService],
    }).compile();

    service = module.get<CollateralsService>(CollateralsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
