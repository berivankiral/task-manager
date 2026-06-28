import { Controller, Post, Get, Body, UseGuards, Request, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiCookieAuth } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { Response } from 'express';
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

  @ApiOperation({ summary: 'Login and receive a session cookie' })
  @Throttle({ default: {limit: 5, ttl: 60000}})
  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(dto);
    //return this.authService.login(dto);

    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', //strict-> linkten tıklandığında cookie gönderilmez, lax-> linkten tıklandığında cookie gönderilir, cross-site requestlerde gönderilmez
      maxAge: 7 * 24 * 60 * 60 * 1000 
    });
    return result;
  }

  @ApiOperation({ summary: 'Logout and clear cookie' })
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    return { message: 'Logged out successfully' };
  }

  @ApiOperation({ summary: 'Get current user profile' })
  @ApiCookieAuth()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Request() req) {
    return this.authService.me(req.user);
  }
}