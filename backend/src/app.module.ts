import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { LeadsModule } from './leads/leads.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, LeadsModule],
  controllers: [HealthController],
})
export class AppModule {}
