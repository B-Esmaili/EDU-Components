import { Test, TestingModule } from '@nestjs/testing';
import { DemoFeatService } from './demo-feat.service';

describe('DemoFeatService', () => {
  let service: DemoFeatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DemoFeatService],
    }).compile();

    service = module.get<DemoFeatService>(DemoFeatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
