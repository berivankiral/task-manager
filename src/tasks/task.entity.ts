import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Index,} from 'typeorm';
import { User } from '../auth/user.entity';

@Entity('tasks')
@Index(['userId', 'status'])   
@Index(['userId', 'priority']) 
//@Index(['userId', 'status', 'priority'])
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 'todo' })
  status: 'todo' | 'in_progress' | 'done';

  @Column({ nullable: true })
  priority: 'low' | 'medium' | 'high';

  @Column({ nullable: true })
  dueDate: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Index()
  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}