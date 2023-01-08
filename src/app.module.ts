import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { SECRET as secret } from './config/enviroment';
import { isAuthenticated } from './middleware/auth.middleware';
import { TaskController } from './task/task.controller';
import { UserService } from './user/user.service';
import { TaskService } from './task/task.service';
import { UserController } from './user/user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './model/user.schema';
import { TaskSchema } from './model/task.schema';
import * as secrets from './config/enviroment';

@Module({
  imports: [
    MongooseModule.forRoot(secrets.DB_URL),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Task', schema: TaskSchema }]),
    JwtModule.register({
      secret,
      signOptions: { expiresIn: '30m' },
    }),
  ],
  controllers: [AppController, UserController, TaskController],
  providers: [AppService, UserService, TaskService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(isAuthenticated)
      .exclude({ path: 'api/v1/task/:id', method: RequestMethod.GET })
      .forRoutes(TaskController);
  }
}
