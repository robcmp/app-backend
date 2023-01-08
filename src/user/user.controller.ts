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
  async signUp(@Res() response, @Body() user: User) {
    this.logger.log('Creando usuario..');
    const newUser = await this.userService.signUp(user);
    if ('keyValue' in newUser) {
      let error = 'Mail is already taken';

      return response.status(204).send({
        statusCode: '204',
        message: 'El correo ya fue usado',
        errors: [error],
      });
    }
    this.logger.log('Usuario creado exitosamente..');
    return response.status(HttpStatus.CREATED).json({ newUser });
  }

  @Post('/signin')
  async signIn(@Res() response, @Body() user: User) {
    this.logger.log('Realizando logeo de usuario...');
    const token = await this.userService.signIn(user, this.jwtService);

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
  async getdTaskByUserId(
    @Res() response,
    @Param('id', ParseObjectIdPipe) id,
  ): Promise<Object> {
    this.logger.log(`Obteniendo tarea por id de usuario: ${id}`);
    const userById = await this.userService.getUserById(id);
    if (userById === null) {
      let error = `User not found`;

      return response.status(404).send({
        statusCode: '404',
        message: 'No se han encontrado al usuario',
        errors: [error],
      });
    }
    this.logger.log(`Tareas de usuario: [${id}] obtenida(s) exitosamente`);
    return response.status(HttpStatus.OK).json(userById);
  }
}
