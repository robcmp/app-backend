import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../model/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  logger = new Logger(UserService.name);

  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}

  async signup(user: User): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(user.password, salt);
    const reqBody = {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      password: hash,
    };
    const newUser = new this.userModel(reqBody);
    return newUser.save();
  }

  async signin(user: User, jwt: JwtService): Promise<any> {
    try {
      const foundUser = await this.userModel
        .findOne({ email: user.email })
        .exec();
      if (foundUser) {
        const { password } = foundUser;
        if (bcrypt.compare(user.password, password)) {
          const payload = { email: user.email };
          return {
            token: jwt.sign(payload),
            id: foundUser._id,
          };
        }
        return new HttpException(
          'Incorrect username or password',
          HttpStatus.UNAUTHORIZED,
        );
      } else {
        this.logger.error('Error - Incorrect username or password');
        return { token: '' };
      }
    } catch (err) {
      this.logger.error('Error - sign in User', err);
      throw err;
    }
  }

  async getOne(email): Promise<User> {
    return await this.userModel.findOne({ email }).exec();
  }

  async getUserById(id): Promise<User> {
    return await this.userModel
      .findOne({ _id: id }, { firstname: 1, lastname: 1 })
      .exec();
  }
}
