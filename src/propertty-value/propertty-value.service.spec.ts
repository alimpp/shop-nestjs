import { Test, TestingModule } from '@nestjs/testing';
import { ProperttyValueService } from './propertty-value.service';

describe('ProperttyValueService', () => {
  let service: ProperttyValueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProperttyValueService],
    }).compile();

    service = module.get<ProperttyValueService>(ProperttyValueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
