import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateTransactionDto {
  user: string;

  
  transactionId: string;
  type: string;
  description: string;
  status: string;

  amount: number;

  currency: string;
  
}
