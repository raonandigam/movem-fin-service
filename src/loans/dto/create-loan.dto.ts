import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateLoanDto {
  // @ApiProperty()
  // @IsNotEmpty()
  borrower: string;

  // @ApiProperty()
  // readonly lender: string;

  // @ApiProperty()
  // readonly collateral: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly amount: number;

  @ApiProperty()
  @IsNotEmpty()
  readonly tenor: number;

  @ApiProperty()
  @IsNotEmpty()
  readonly rate: number;

  @ApiProperty()
  @IsNotEmpty()
  readonly collateral: string;
}
