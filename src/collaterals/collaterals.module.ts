import { Module } from '@nestjs/common';
import { CollateralsService } from './collaterals.service';
import { CollateralsController } from './collaterals.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Collateral, CollateralSchema } from './schemas/collateral.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Collateral.name, schema: CollateralSchema },
    ]),
  ],
  controllers: [CollateralsController],
  providers: [CollateralsService],
})
export class CollateralsModule {}
