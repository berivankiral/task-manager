import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,} from 'typeorm';
import { User } from '../auth/user.entity';

@Entity('tasks')
@Index(['userId', 'status', 'createdAt'])   
@Index(['userId', 'priority', 'createdAt']) 
//@Index(['userId', 'status', 'priority'])
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', default: 'todo' })
  status: 'todo' | 'in_progress' | 'done';

  @Column({ type: 'varchar', default: 'medium', nullable: true })
  priority: 'low' | 'medium' | 'high';

  @Column({ type: 'varchar', nullable: true })
  dueDate: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({name: 'userId'})
  user: User;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}