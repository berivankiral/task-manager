import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as crypto from 'crypto';

@Injectable()
export class JwtService {
  private readonly secret: string;
  private readonly expiresIn: number;

  constructor(
    private config: ConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    this.secret = this.config.get<string>('JWT_SECRET') ?? 'fallback_secret';
    this.expiresIn = 7 * 24 * 60 * 60;
  }

  sign(payload: Record<string, unknown>): string {
    const header = this.base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const now = Math.floor(Date.now() / 1000);
    const body = this.base64url(JSON.stringify({
      ...payload,
      iat: now,
      exp: now + this.expiresIn,
    }));
    const signature = this.sign256(`${header}.${body}`);
    return `${header}.${body}.${signature}`;
  }

  verify(token: string): Record<string, unknown> {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new UnauthorizedException('Invalid token format');
    }
    const [header, body, signature] = parts;
    const expectedSignature = this.sign256(`${header}.${body}`);
    if (!crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )) {
      throw new UnauthorizedException('Invalid token signature');
    }
    const payload = JSON.parse(
      Buffer.from(body, 'base64url').toString('utf8')
    ) as Record<string, unknown>;
    const now = Math.floor(Date.now() / 1000);
    if (typeof payload.exp === 'number' && payload.exp < now) {
      throw new UnauthorizedException('Token expired');
    }
    return payload;
  }

  async validateUser(token: string): Promise<User> {
    const payload = this.verify(token);
    const user = await this.userRepository.findOne({
      where: { id: payload.sub as string },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) throw new UnauthorizedException('User not found');
    return user;
  }

  private base64url(str: string): string {
    return Buffer.from(str)
      .toString('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }

  private sign256(data: string): string {
    return crypto
      .createHmac('sha256', this.secret)
      .update(data)
      .digest('base64url');
  }
}