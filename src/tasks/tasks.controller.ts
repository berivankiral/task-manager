import {Controller, Get, Post, Patch, Delete,Body, Param, Query, UseGuards, Request,} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {RolesGuard} from '../auth/roles.guard';
import {Roles} from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';
import { User } from '../auth/user.entity';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @ApiOperation({ summary: 'Create a new task' })
  @Post()
  create(@Body() dto: CreateTaskDto, @Request() req) {
    return this.tasksService.create(dto, req.user as User);
  }

  @ApiOperation({ summary: 'List all tasks' })
  @Get()
  findAll(@Request() req, @Query('status') status?: string, @Query('priority') priority?: string) {
    return this.tasksService.findAll(req.user as User, { status, priority });
  }

  @ApiOperation({ summary: 'Get a single task' })
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.tasksService.findOne(id, req.user as User);
  }

  @ApiOperation({ summary: 'Update a task' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto, @Request() req) {
    return this.tasksService.update(id, dto, req.user as User);
  }

  @ApiOperation({ summary: 'Delete a task' })
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
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