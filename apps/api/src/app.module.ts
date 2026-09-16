import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { HealthController } from './health.controller';
import { LeadsModule } from './leads/leads.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, AuthModule, LeadsModule],
  controllers: [HealthController],
})
export class AppModule {}
