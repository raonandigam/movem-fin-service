import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CollateralsService } from './collaterals.service';
import { CreateCollateralDto } from './dto/create-collateral.dto';

@Controller('collaterals')
export class CollateralsController {
  constructor(private readonly collateralsService: CollateralsService) {}

  @Post()
  create(@Body() createCollateralDto: CreateCollateralDto) {
    return this.collateralsService.create(createCollateralDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.collateralsService.findOne(+id);
  }
}
