import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { LendDto } from './dto/lend.dto';
import { LoanRequestFilterDto } from './dto/loan-request-filter.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { Loan, LoanDocument } from './schemas/loan.schema';

@Injectable()
export class LoansService {
  constructor(
    @InjectModel(Loan.name) private readonly loanModel: Model<LoanDocument>,
    private readonly userService: UsersService,
  ) {}

  async create(createLoanDto: CreateLoanDto) {
    const createdLoan = await this.loanModel.create(createLoanDto);
    return createdLoan;
  }

  async getPendingLoanRequests(requestFilter: LoanRequestFilterDto) {
    // TODO - Filter from request
    return await this.loanModel.find({ is_pending: true }).populate('borrower','-password_hash');
  }

  async lend(loanId: string, lenderId: string) {
    const loan = await this.loanModel.findById(loanId);
    const lender = await this.userService.findById(lenderId);
    if (!loan) {
      throw new HttpException('Loan not found', HttpStatus.BAD_REQUEST);
    }
    if (!lender || lender === null) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    if (!loan.is_pending || loan.lender) {
      throw new HttpException('Loan already processed', HttpStatus.BAD_REQUEST);
    }
    loan.is_pending = false;
    loan.lender = lender;
    return await loan.save();
  }

  async findAll() {
    return await this.loanModel.find().exec();
  }

  async findOne(id: string) {
    return await this.loanModel
      .findById(id)
      .populate('borrower','-password_hash')
      .populate('lender','-password_hash')
      .exec();
  }

  async getLoansForUser(userId: string) {
    return await this.loanModel
      .find({ $or: [{ borrower: userId }, { lender: userId }] })
      .populate('borrower','-password_hash')
      .populate('lender','-password_hash')
      .exec();
  }

  async getLentLoansForUser(userId: string) {
    return await this.loanModel.find({ lender: userId }).exec();
  }

  async update(id: string, updateLoanDto: UpdateLoanDto) {
    return await this.loanModel.findByIdAndUpdate(id, updateLoanDto);
  }

  async remove(id: string) {
    const deletedCat = await this.loanModel
      .findByIdAndRemove({ _id: id })
      .exec();
    return deletedCat;
  }
}
