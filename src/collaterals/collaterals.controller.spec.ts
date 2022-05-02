import { Test, TestingModule } from '@nestjs/testing';
import { CollateralsController } from './collaterals.controller';
import { CollateralsService } from './collaterals.service';

describe('CollateralsController', () => {
  let controller: CollateralsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CollateralsController],
      providers: [CollateralsService],
    }).compile();

    controller = module.get<CollateralsController>(CollateralsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
