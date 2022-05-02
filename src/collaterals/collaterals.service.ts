import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCollateralDto } from './dto/create-collateral.dto';
import { Collateral, CollateralDocument } from './schemas/collateral.entity';

@Injectable()
export class CollateralsService {
  constructor(
    @InjectModel(Collateral.name)
    private readonly collateralModel: Model<CollateralDocument>,
  ) {}

  create(createCollateralDto: CreateCollateralDto) {
    return this.collateralModel.create(createCollateralDto);
  }

  findOne(id: number) {
    return `This action returns a #${id} collateral`;
  }

  async pledge(collateralId: string) {
    const collateral = await this.collateralModel.findById(collateralId);

    if (collateral.is_pledged) {
      throw new HttpException('Already pledged', HttpStatus.BAD_REQUEST);
    }

    collateral.is_pledged = true;
    return await collateral.save();
  }
}
