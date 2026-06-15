import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @Throttle({ default: {limit: 5, ttl: 60000}})
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @ApiOperation({ summary: 'Login and receive a bearer token' })
  @Throttle({ default: {limit: 5, ttl: 60000}})
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @ApiOperation({ summary: 'Get logged-in user information' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Request() req) {
    return this.authService.me(req.user);
  }
}