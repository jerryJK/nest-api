import { Injectable } from '@nestjs/common';
import * as Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService {
  private readonly redisClient;

  constructor(private readonly configService: ConfigService) {
    this.redisClient = new Redis({
      host: this.configService.get('REDIS_HOST'),
    });
  }

  getRedisClient() {
    return this.redisClient;
  }
}
