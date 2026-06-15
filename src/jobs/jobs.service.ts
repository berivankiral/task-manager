import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from './job.entity';
import { Task } from '../tasks/task.entity';
import { User } from '../auth/user.entity';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async create(user: User): Promise<Job> {
    const job = this.jobRepository.create({
      type: 'task_summary',
      status: 'pending',
      userId: user.id,
    });
    await this.jobRepository.save(job);
    this.processJob(job.id, user.id);
    return job;
  }

  private async processJob(jobId: string, userId: string): Promise<void> {
    try {
      await this.jobRepository.update(jobId, { status: 'processing' });

      const todo = await this.taskRepository.count({ where: { userId, status: 'todo' } });
      const inProgress = await this.taskRepository.count({ where: { userId, status: 'in_progress' } });
      const done = await this.taskRepository.count({ where: { userId, status: 'done' } });

      const result = `You have ${todo} todo tasks, ${inProgress} in progress tasks, and ${done} completed tasks.`;

      await this.jobRepository.update(jobId, { status: 'completed', result });
    } catch {
      await this.jobRepository.update(jobId, { status: 'failed' });
    }
  }

  async findAll(user: User): Promise<Job[]> {
    return this.jobRepository.find({
      where: { userId: user.id },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, user: User): Promise<Job> {
    const job = await this.jobRepository.findOne({ where: { id } });
    if (!job) throw new NotFoundException('Job bulunamadı');
    if (job.userId !== user.id) throw new ForbiddenException('Bu joba erişemezsiniz');
    return job;
  }
}