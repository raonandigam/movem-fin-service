import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { LoansService } from './loans.service';
import { Loan } from './schemas/loan.schema';

describe('LoansService', () => {
  let service: LoansService;
  const loanModel = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoansService,
        {
          provide: getModelToken(Loan.name),
          useValue: {
            new: jest.fn().mockResolvedValue(loanModel),
            constructor: jest.fn().mockResolvedValue(loanModel),
            find: jest.fn(),
            create: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
      // providers: [LoansService],
    }).compile();

    service = module.get<LoansService>(LoansService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
