import {Controller, Get, Post, Patch, Delete,Body, Param, Query, UseGuards, Request,} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiCookieAuth, ApiQuery} from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {RolesGuard} from '../auth/roles.guard';
import {Roles} from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';
import { User } from '../auth/user.entity';
import { FastifyRequest } from 'fastify';

@ApiTags('Tasks')
@ApiBearerAuth()
@ApiCookieAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @ApiOperation({ summary: 'Create a new task' })
  @Post()
  create(@Body() dto: CreateTaskDto, @Request() req: FastifyRequest & { user: User }) {
    return this.tasksService.create(dto, req.user as User);
  }

  @ApiOperation({ summary: 'List all tasks with filtering and pagination' })
  @ApiQuery({ name: 'status', required: false, enum: ['todo', 'in_progress', 'done'], type: String, description: 'Filter by status (todo, in_progress, done)' })
  @ApiQuery({ name: 'priority', required: false, enum: ['low', 'medium', 'high'], type: String, description: 'Filter by priority (low, medium, high)' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of tasks per page for pagination' })
  @Get()
  findAll(@Request() req: FastifyRequest & { user: User }, 
  @Query('status') status?: string, 
  @Query('priority') priority?: string,
  @Query('page') page?: string, 
  @Query('limit') limit?: string) {
    return this.tasksService.findAll(req.user as User, { 
      status, 
      priority, 
      page : page? Number(page): undefined, 
      limit: limit? Number(limit): undefined });
  }

  @ApiOperation({ summary: 'Get a single task' })
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: FastifyRequest & { user: User }) {
    return this.tasksService.findOne(id, req.user as User);
  }

  @ApiOperation({ summary: 'Update a task' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto, @Request() req: FastifyRequest & { user: User }) {
    return this.tasksService.update(id, dto, req.user as User);
  }

  @ApiOperation({ summary: 'Delete a task' })
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: FastifyRequest & { user: User }) {
    return this.tasksService.remove(id, req.user as User);
  }

  @ApiOperation({ summary: 'Admin-only: Get all tasks' })
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Get('admin/all')
  findAllAdmin() {
    return this.tasksService.findAllAdmin();
  } 
}