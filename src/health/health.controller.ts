import { Controller, Get } from '@nestjs/common';
import * as os from 'os';

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      instance: process.env.INSTANCE_ID || os.hostname(),
    };
  }
}