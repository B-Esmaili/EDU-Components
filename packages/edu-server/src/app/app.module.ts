import { Module } from '@nestjs/common';
import { DemoFeatModule } from '../demo-feat/demo-feat.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [DemoFeatModule,MongooseModule.forRoot('mongodb://localhost:27017',{
    dbName:"edu-db",
    user: "root",
    pass: "123"
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
