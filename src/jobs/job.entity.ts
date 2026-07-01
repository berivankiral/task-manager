import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { User } from '../auth/user.entity';

@Entity('jobs')
@Index(['userId', 'status'])
@Index(['status', 'createdAt'])
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'task_summary' })
  type: string;

  @Column({ default: 'pending' })
  status: 'pending' | 'processing' | 'completed' | 'failed';

  @Column({ type: 'text', nullable: true })
  result: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  //@Index()
  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}