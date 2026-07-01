import { Controller, Get, Req } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import type { FastifyRequest } from 'fastify';
import * as os from 'os';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @ApiOperation({ summary: 'Check API health and load balancer status' })
  @Get()
  check(@Req() req: FastifyRequest) {
    return {
      status: 'ok',
      instance: process.env.INSTANCE_ID || os.hostname(),
      
      clientIp: (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip,
    };
  }
}