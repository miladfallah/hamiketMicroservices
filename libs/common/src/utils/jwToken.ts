// jwToken.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';

@Injectable()
export class JwTokenService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
    private readonly jwtService: JwtService,
  ) {}

  generateToken(user: any, role: 'user' | 'admin'): string {
    const payload = { sub: user.id, role };
    return this.jwtService.sign(payload);
  }

  async saveTokenInRedis(token: string, userId: number): Promise<void> {
    const redisKey = `authToken:${userId}`;
    await this.redisClient.set(redisKey, token, 'EX', 3600);
  }
}
