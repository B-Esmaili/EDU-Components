import { PartialType } from '@nestjs/mapped-types';
import { CreateDemoFeatDto } from './create-demo-feat.dto';

export class UpdateDemoFeatDto extends PartialType(CreateDemoFeatDto) {}
