import { Controller, Get, Post, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JobsService } from './jobs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../auth/user.entity';

@ApiTags('Jobs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('jobs')
export class JobsController {
  constructor(private jobsService: JobsService) {}

  @ApiOperation({ summary: 'Yeni job oluştur' })
  @Post()
  create(@Request() req) {
    return this.jobsService.create(req.user as User);
  }

  @ApiOperation({ summary: 'Tüm jobları listele' })
  @Get()
  findAll(@Request() req) {
    return this.jobsService.findAll(req.user as User);
  }

  @ApiOperation({ summary: 'Tek job getir' })
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.jobsService.findOne(id, req.user as User);
  }
}