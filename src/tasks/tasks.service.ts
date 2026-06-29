import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { User } from '../auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async create(dto: CreateTaskDto, user: User): Promise<Task> {
    const task = this.taskRepository.create({
      ...dto,
      userId: user.id,
    });
    return this.taskRepository.save(task);
  }

  async findAll(user: User, filters: { status?: string; priority?: string; page?: number; limit?: number }
  ): Promise<{data: Task[]; total: number; page: number; limit: number}> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;
    const skip = (page - 1) * limit;

    const query = this.taskRepository.createQueryBuilder('task')
      .where('task.userId = :userId', { userId: user.id });

    if (filters.status) {
      query.andWhere('task.status = :status', { status: filters.status });
    }
    if (filters.priority) {
      query.andWhere('task.priority = :priority', { priority: filters.priority });
    }

    const total = await query.getCount();
    const data = await query.orderBy('task.createdAt', 'DESC').skip(skip).take(limit).getMany();
    return { data, total, page, limit };
  }

  async findOne(id: string, user: User): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id, userId: user.id } });
    if (!task) throw new NotFoundException('Task not found');
    //if (task.userId !== user.id) throw new ForbiddenException('Bu göreve erişemezsiniz');
    return task;
  }

  async update(id: string, dto: UpdateTaskDto, user: User): Promise<Task> {
    const task = await this.findOne(id, user);
    Object.assign(task, dto);
    return this.taskRepository.save(task);
  }

  async remove(id: string, user: User): Promise<{ message: string }> {
    const task = await this.findOne(id, user);
    await this.taskRepository.remove(task);
    return { message: 'Task deleted successfully' };
  }
  
  async findAllAdmin(): Promise<Task[]> {
    return this.taskRepository.find({ order: { createdAt: 'DESC' } });
  }
}