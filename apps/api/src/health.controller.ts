import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOkResponse({ description: 'Confirma que a API está disponível.' })
  check() {
    return { status: 'ok' };
  }
}
