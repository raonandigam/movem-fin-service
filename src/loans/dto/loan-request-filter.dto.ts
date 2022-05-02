import { ApiProperty } from '@nestjs/swagger';

export class LoanRequestFilterDto {
  @ApiProperty()
  readonly amount_min: number;

  @ApiProperty()
  readonly amount_max: number;

  @ApiProperty()
  readonly tenor_min: number;

  @ApiProperty()
  readonly tenor_max: number;

  @ApiProperty()
  readonly collateral_type: string;

  // @ApiProperty()
  // readonly rate: number;
}
