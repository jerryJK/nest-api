import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { SignupRequestDto } from './dto/signupRequestDto';
import { CONFIRM_EMAIL_PREFIX } from './constants';
import { RedisService } from '../redis/redis.service';
import { MailService } from '../mail/mail.service';
import { v4 } from 'uuid';
import { LoginRequestDto } from './dto/loginRequestDto';
import { LoginResponseDto } from './dto/loginResponseDto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UserMapper } from '../user/mapper/userMapper';
import { HttpStatusResponse } from '../shared/httpStatusResponse';
import { GetUserResponseDto } from '../user/dto/getUserResponseDto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private redisService: RedisService,
    private mailService: MailService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string): Promise<GetUserResponseDto> {
    const user = await this.userService.findUser(email);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return UserMapper.fromEntity(user);
  }

  async signup(data: SignupRequestDto): Promise<HttpStatusResponse> {
    const user = await this.userService.findUser(data.email);

    if (!user) {
      const user = await this.userService.createUser(data);
      await this.mailService.sendConfirmationEmail(
        data.email,
        await this.generateConfirmationLink(user.id),
      );
      return {
        status: HttpStatus.OK,
      };
    }
    throw new HttpException('User already exist', HttpStatus.CONFLICT);
  }

  async confirmEmail(id: string): Promise<void> {
    const redisClient = this.redisService.getRedisClient();
    const userId = await redisClient.get(`${CONFIRM_EMAIL_PREFIX}${id}`);
    if (!userId) {
      throw NotFoundException;
    }
    return await this.userService.confirmUser(userId);
  }

  async generateConfirmationLink(userId: string) {
    const redisClient = this.redisService.getRedisClient();

    // generate link id
    const id = v4();
    const expirationTime = 60 * 60; // 1h

    // save userId in redis
    await redisClient.set(
      `${CONFIRM_EMAIL_PREFIX}${id}`,
      userId,
      'ex',
      expirationTime,
    );

    return process.env.NODE_ENV === 'development'
      ? `${process.env.HOST}:${process.env.PORT}/auth/confirm/${id}`
      : `${process.env.HOST}/auth/confirm/${id}`;
  }

  async login({ email, password }: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.userService.findUser(email);

    if (!user) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (user.confirmed === false) {
      throw new HttpException('Email not confirmed', HttpStatus.UNAUTHORIZED);
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return {
      status: HttpStatus.OK,
      token: this.jwtService.sign({ email: user.email, sub: user.id }),
    };
  }

  async resendConfirmationLink(email: string): Promise<HttpStatusResponse> {
    const user = await this.userService.findUser(email);

    if (user) {
      await this.mailService.sendConfirmationEmail(
        email,
        await this.generateConfirmationLink(user.id),
      );
    }
    // we always return status 200 for security reasons
    // prevents checking if an email exists in the database
    return {
      status: HttpStatus.OK,
    };
  }
}
