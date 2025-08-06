import { Test, TestingModule } from '@nestjs/testing';
import { ProperttyService } from './propertty.service';

describe('ProperttyService', () => {
  let service: ProperttyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProperttyService],
    }).compile();

    service = module.get<ProperttyService>(ProperttyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
