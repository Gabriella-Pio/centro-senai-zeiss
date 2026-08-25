import { LeadStatus } from '../../../generated/prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateLeadStatusDto {
  @IsEnum(LeadStatus)
  status!: LeadStatus;
}
