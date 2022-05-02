import { Module } from '@nestjs/common';
import { CircleController } from 'src/circle/circle.controller';
import { BlockchainService } from './blockchain.service';

@Module({
  providers: [BlockchainService]
})
export class BlockchainModule {}
