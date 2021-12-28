import { Module } from '@nestjs/common';
import { DalService } from './dal.service';
import { DalController } from './dal.controller';

@Module({
  providers: [DalService],
  controllers: [DalController]
})
export class DalModule {}
