import { IsEmail, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MaxLength(64)
  password: string;
}