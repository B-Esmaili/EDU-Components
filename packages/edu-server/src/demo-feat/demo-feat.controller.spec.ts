import { Test, TestingModule } from '@nestjs/testing';
import { DemoFeatController } from './demo-feat.controller';
import { DemoFeatService } from './demo-feat.service';

describe('DemoFeatController', () => {
  let controller: DemoFeatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DemoFeatController],
      providers: [DemoFeatService],
    }).compile();

    controller = module.get<DemoFeatController>(DemoFeatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
