import { Controller, Get } from '@nestjs/common';
import { AbstractResponse } from './common/dto/abstract-response.dto';

@Controller()
export class AppController {
  // simple health check endpoint to verify server is running
  @Get('health')
  healthCheck() {
    return AbstractResponse.success({ status: 'ok' }, 'Health check passed');
  }
}
