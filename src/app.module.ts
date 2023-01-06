import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongoDbModule } from './services/database/database.service';
import { JwtModule } from '@nestjs/jwt';
import { SECRET as secret } from './config/enviroment';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path/posix';
import { isAuthenticated } from './middleware/auth.middleware';
import { TaskController } from './task/task.controller';

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

export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(isAuthenticated)
      .exclude(
        { path: 'api/v1/task/:id', method: RequestMethod.GET }
      )
      .forRoutes(TaskController);
  }
}
