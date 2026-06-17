import { Controller, Get, Req } from '@nestjs/common';
import type { Request } from 'express';
import * as os from 'os';

@Controller('health')
export class HealthController {
  @Get()
  check(@Req() req: Request) {
    return {
      status: 'ok',
      instance: process.env.INSTANCE_ID || os.hostname(),
      clientIp: req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.ip,
    };
  }
}