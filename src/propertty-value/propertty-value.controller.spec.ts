import { Test, TestingModule } from '@nestjs/testing';
import { ProperttyValueController } from './propertty-value.controller';

describe('ProperttyValueController', () => {
  let controller: ProperttyValueController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProperttyValueController],
    }).compile();

    controller = module.get<ProperttyValueController>(ProperttyValueController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
