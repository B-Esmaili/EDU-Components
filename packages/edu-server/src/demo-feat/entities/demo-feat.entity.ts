import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class DemoFeat {
  @Prop()
  name: string;
}

export type DemoFeatDocument = DemoFeat & Document;

export const DemoFeatSchema = SchemaFactory.createForClass(DemoFeat);
