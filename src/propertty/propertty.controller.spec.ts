import { Test, TestingModule } from '@nestjs/testing';
import { ProperttyController } from './propertty.controller';

describe('ProperttyController', () => {
  let controller: ProperttyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProperttyController],
    }).compile();

    controller = module.get<ProperttyController>(ProperttyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
