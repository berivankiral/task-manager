import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';
import { IsOptional, IsIn } from 'class-validator';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiPropertyOptional({
    enum: ['todo', 'in_progress', 'done'],
    default: 'todo',
  })
  @IsOptional()
  @IsIn(['todo', 'in_progress', 'done'])
  status?: 'todo' | 'in_progress' | 'done';
}