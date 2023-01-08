import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  Res,
  Logger,
} from '@nestjs/common';
import { User } from '../model/user.schema';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { ParseObjectIdPipe } from 'src/utils/parse-object-id-pipe.pipe';

@Controller('/api/v1')
export class UserController {
  logger = new Logger(UserController.name);
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  @Post('/signup')
  async Signup(@Res() response, @Body() user: User) {
    const newUSer = await this.userService.signup(user);
    return response.status(HttpStatus.CREATED).json({
      newUSer,
    });
  }

  @Post('/signin')
  async SignIn(@Res() response, @Body() user: User) {
    this.logger.log('Realizando logeo de usuario...');
    const token = await this.userService.signin(user, this.jwtService);

    if (token.token === '') {
      let error = `Incorrect user or password`;

      return response.status(401).send({
        statusCode: '401',
        message: 'Se han encontrado errores al hacer login',
        errors: [error],
      });
    }
    this.logger.log('Logeo de usuario realizado exitosamente');
    return response.status(HttpStatus.OK).json(token);
  }

  @Get('/user/:id')
  async readTaskById(
    @Res() response,
    @Param('id', ParseObjectIdPipe) id,
  ): Promise<Object> {
    const userById = await this.userService.getUserById(id);

    if (userById === null) {
      let error = `User not found`;

      return response.status(404).send({
        statusCode: '404',
        message: 'No se han encontrado al usuario',
        errors: [error],
      });
    }
    return response.status(HttpStatus.OK).json(userById);
  }
}
