import { IsOptional, IsIn } from 'class-validator';

export class CreateJobDto {
  @IsOptional()
  @IsIn(['task_summary'])
  type?: 'task_summary';
}