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
} from '@nestjs/common';
import { User } from '../model/user.schema';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Controller('/api/v1')
export class UserController {
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
}
