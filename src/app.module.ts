import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongoDbModule } from './services/database/database.service';
import { JwtModule } from '@nestjs/jwt';
import { SECRET as secret } from './config/enviroment';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path/posix';

@Module({
  imports: [
    MongoDbModule,
    JwtModule.register({
      secret,
      signOptions: { expiresIn: '2h' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
