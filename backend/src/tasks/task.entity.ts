import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, ManyToOne,
} from 'typeorm';
import { User } from '../users/user.entity';

export enum Urgency {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum TaskStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  FULFILLED = 'FULFILLED',
  CANCELLED = 'CANCELLED',
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  category: string;

  @Column({ nullable: true })
  location: string;

  @Column({ type: 'enum', enum: Urgency, default: Urgency.NORMAL })
  urgency: Urgency;

  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.OPEN })
  status: TaskStatus;

  @ManyToOne(() => User, { eager: true })
  author: User;

  @ManyToOne(() => User, { nullable: true, eager: true })
  helper: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
