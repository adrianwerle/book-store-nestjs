import { Test, TestingModule } from '@nestjs/testing';
import { DalController } from './dal.controller';

describe('DalController', () => {
  let controller: DalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DalController],
    }).compile();

    controller = module.get<DalController>(DalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
