import { IsString, IsOptional, IsIn, MinLength, MaxLength, IsDateString, Matches} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ example: 'Projeect meeting', maxLength: 150 })
  @IsString()
  @MinLength(3)
  @MaxLength(150)
   @Matches(/^[a-zA-Z0-9\s\u00C0-\u024F.,!?()-]+$/, {
    message: 'Title can only contain letters, numbers and basic punctuation',
  })
  title: string;

  @ApiPropertyOptional({ example: 'Discussing the new features on Monday at 10 AM', maxLength: 1000 })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  @Matches(/^[a-zA-Z0-9\s\u00C0-\u024F.,!?():\-\n]+$/, {
    message: 'Description can only contain letters, numbers and basic punctuation',
  })
  description?: string;

  @ApiPropertyOptional({ enum: ['low', 'medium', 'high'] })
  @IsOptional()
  @IsIn(['low', 'medium', 'high'])
  priority?: 'low' | 'medium' | 'high';

  @ApiPropertyOptional({ example: '2026-06-10' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;
}