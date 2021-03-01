import { Injectable } from '@nestjs/common';
import * as Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly redisClient = new Redis({ host: 'redis' });

  getRedisClient() {
    return this.redisClient;
  }
}
