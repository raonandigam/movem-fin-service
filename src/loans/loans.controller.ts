import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LoansService } from './loans.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { LoanRequestFilterDto } from './dto/loan-request-filter.dto';
import { LendDto } from './dto/lend.dto';
import { PledgeDto } from './dto/pledge.dto';
import { JwtAuthGuard } from '../auth/jwt-auth-guard';
import { UsersService } from '../users/users.service';

@Controller('loans')
@UseGuards(JwtAuthGuard)
export class LoansController {
  constructor(
    private readonly loansService: LoansService,
    private readonly userService: UsersService,
  ) {}

  @Post()
  create(@Body() createLoanDto: CreateLoanDto, @Req() request) {
    const borrowerId = request.user.userId;
    createLoanDto.borrower = borrowerId;
    return this.loansService.create(createLoanDto);
  }

  @Post('get-pending-requests')
  getPendingLoanRequests(@Body() req: LoanRequestFilterDto) {
    return this.loansService.getPendingLoanRequests(req);
  }

  @Post('lend')
  lend(@Body() lendDto: LendDto, @Req() request) {
    const lenderId = request.user.userId;
    return this.loansService.lend(lendDto.loanId, lenderId);
  }

  @Post('pledge')
  pledge(@Body() req: PledgeDto) {
    // TODO - Add pledge feature
    return this.loansService.findOne(req.loanId);
  }

  @Get('getLoanInfo/:id')
  findOne(@Param('id') id: string) {
    return this.loansService.findOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateLoanDto: UpdateLoanDto) {
  //   return this.loansService.update(id, updateLoanDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.loansService.remove(id);
  // }

  @Get('get-loans-for-user')
  getLoansForUser(@Req() request) {
    const userId = request.user.userId;
    return this.loansService.getLoansForUser(userId);
  }

  @Get('get-lent-loans-for-user')
  getLentLoansForUser(@Req() request) {
    const userId = request.user.userId;
    return this.loansService.getLentLoansForUser(userId);
  }
}
