import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DemoFeatService } from './demo-feat.service';
import { CreateDemoFeatDto } from './dto/create-demo-feat.dto';
import { UpdateDemoFeatDto } from './dto/update-demo-feat.dto';

@Controller('demo-feat')
export class DemoFeatController {
  constructor(private readonly demoFeatService: DemoFeatService) {}

  @Post()
  create(@Body() createDemoFeatDto: CreateDemoFeatDto) {
    return this.demoFeatService.create(createDemoFeatDto);
  }

  @Get()
  findAll() {
    return this.demoFeatService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.demoFeatService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDemoFeatDto: UpdateDemoFeatDto
  ) {
    return this.demoFeatService.update(+id, updateDemoFeatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.demoFeatService.remove(+id);
  }
}
