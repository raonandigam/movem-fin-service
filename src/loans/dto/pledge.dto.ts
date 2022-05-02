import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class PledgeDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly collateralId: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly loanId: string;
}
