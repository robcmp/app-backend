import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as secrets from '../../config/enviroment';

@Module({
  imports: [
    MongooseModule.forRoot(secrets.DB_URL),
  ],
})
export class MongoDbModule {}