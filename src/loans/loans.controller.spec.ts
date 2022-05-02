import { Test, TestingModule } from '@nestjs/testing';
import { LoansController } from './loans.controller';
import { LoansService } from './loans.service';

describe('LoansController', () => {
  let controller: LoansController;

  const createLoanDto = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoansController],
      providers: [
        {
          provide: LoansService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([
              {
                borrower: 'b1',
                amount: 10000,
                tenor: 6,
                rate: 3.5,
              },
            ]),
            create: jest.fn().mockResolvedValue(createLoanDto),
          },
        },
      ],
    }).compile();

    controller = module.get<LoansController>(LoansController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
