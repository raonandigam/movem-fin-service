import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { VeriteService } from './verite.service';

@Controller('verite')
export class VeriteController {
  constructor(private readonly VeriteService: VeriteService) {}

  @Post('issue-kyc')
  issueKYC(@Body('userId') userId: string) {
    return this.VeriteService.issueKYC(userId);
  }

  @Post('verify-kyc')
  verifyKYC(@Body('userId') userId: string) {
    return this.VeriteService.verifyKYC(userId);
  }
}
