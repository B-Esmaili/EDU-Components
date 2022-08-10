import { Module } from '@nestjs/common';
import { DemoFeatService } from './demo-feat.service';
import { DemoFeatController } from './demo-feat.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DemoFeat, DemoFeatSchema } from './entities/demo-feat.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: DemoFeat.name, schema: DemoFeatSchema }])],
  controllers: [DemoFeatController],
  providers: [DemoFeatService]
})
export class DemoFeatModule {}
