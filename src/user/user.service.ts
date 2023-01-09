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

  async signUp(user: User): Promise<User> {
    try {
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(user.password, salt);
      const reqBody = {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        password: hash,
      };
      const newUser = new this.userModel(reqBody);
      const saveUser = await newUser.save();
      return saveUser;
    } catch (error) {
      this.logger.error('Error - sign up User', error);
      return error;
    }
  }

  async signIn(user: User, jwt: JwtService): Promise<any> {
    try {
      const foundUser = await this.userModel
        .findOne({ email: user.email })
        .exec();
      if (foundUser) {
        const { password } = foundUser;
        const passMatching = await bcrypt.compare(user.password, password);
        console.log('passMAtch', passMatching);
        if (passMatching) {
          const payload = { email: user.email, password: user.password };
          return {
            token: jwt.sign(payload),
            id: foundUser._id,
          };
        }
        return { token: '' };
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
    try {
      return await this.userModel
        .findOne({ _id: id }, { firstname: 1, lastname: 1 })
        .exec();
    } catch (err) {
      this.logger.error('Error - obtaining user info', err);
      throw err;
    }
  }
}
