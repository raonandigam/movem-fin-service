import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LendDto {
  // @ApiProperty()
  // @IsNotEmpty()
  // readonly lenderId: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly loanId: string;
}
