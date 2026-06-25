import { IsOptional, IsIn, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateJobDto {
  @ApiPropertyOptional({ enum: ['task_summary'] })
  @IsOptional()
  @IsString()
  @IsIn(['task_summary'])
  type?: 'task_summary';
}