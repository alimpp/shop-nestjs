import { Test, TestingModule } from '@nestjs/testing';
import { UsersDataController } from './users-data.controller';

describe('UsersDataController', () => {
  let controller: UsersDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersDataController],
    }).compile();

    controller = module.get<UsersDataController>(UsersDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
