import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDemoFeatDto } from './dto/create-demo-feat.dto';
import { UpdateDemoFeatDto } from './dto/update-demo-feat.dto';
import { DemoFeat, DemoFeatDocument } from './entities/demo-feat.entity';

@Injectable()
export class DemoFeatService {
  constructor(@InjectModel(DemoFeat.name) private demoFeatModel: Model<DemoFeatDocument>) {}

  create(createDemoFeatDto: CreateDemoFeatDto) {
    return 'This action adds a new demoFeat';
  }

  findAll() {
    this.demoFeatModel.create({
      name : "asdadsasd"
    });
    return `This action returns all demoFeat`;
  }

  findOne(id: number) {
    return `This action returns a #${id} demoFeat`;
  }

  update(id: number, updateDemoFeatDto: UpdateDemoFeatDto) {
    return `This action updates a #${id} demoFeat`;
  }

  remove(id: number) {
    return `This action removes a #${id} demoFeat`;
  }
}
