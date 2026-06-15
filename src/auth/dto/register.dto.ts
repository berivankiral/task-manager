import { IsEmail, IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {

  @ApiProperty( { example: 'user@example.com', maxLength: 255, description: 'Kullanıcının e-posta adresi' })
  @IsEmail()
  @MaxLength(255)
  email: string;

  
  @ApiProperty( { example: 'password123', minLength: 8, maxLength:64})
  @IsString()
  @MinLength(8)
  @MaxLength(64)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
  })
  password: string;
}