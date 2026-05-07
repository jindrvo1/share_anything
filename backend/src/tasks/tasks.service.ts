import {
  Injectable, NotFoundException, ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from './task.entity';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
  ) {}

  async findAll(query: any): Promise<Task[]> {
    const qb = this.taskRepo.createQueryBuilder('task')
      .leftJoinAndSelect('task.author', 'author')
      .leftJoinAndSelect('task.helper', 'helper');

    if (query.status) {
      qb.andWhere('task.status = :status', { status: query.status });
    } else {
      qb.andWhere('task.status = :status', { status: TaskStatus.OPEN });
    }

    if (query.category) {
      qb.andWhere('task.category = :category', { category: query.category });
    }

    if (query.search) {
      qb.andWhere(
        '(task.title ILIKE :search OR task.description ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    return qb.orderBy('task.createdAt', 'DESC').getMany();
  }

  async findById(id: string): Promise<Task> {
    const task = await this.taskRepo.findOne({ where: { id } });
    if (!task) throw new NotFoundException('Úkol nebyl nalezen');
    return task;
  }

  async create(userId: string, data: any): Promise<Task> {
    const author = await this.usersService.findById(userId);
    const task = new Task();
    Object.assign(task, data, { author, status: TaskStatus.OPEN });
    return this.taskRepo.save(task);
  }

  async respond(taskId: string, helperId: string): Promise<Task> {
    const task = await this.findById(taskId);
    if (task.status !== TaskStatus.OPEN) {
      throw new ForbiddenException('Úkol již není otevřený');
    }
    const helper = await this.usersService.findById(helperId);
    task.helper = helper;
    task.status = TaskStatus.IN_PROGRESS;
    const saved = await this.taskRepo.save(task);

    if (task.author?.email) {
      await this.mailService.sendResponseNotification(
        task.author.email,
        task.author.name,
        helper.name,
        task.title,
      );
    }
    return saved;
  }

  async fulfill(taskId: string, userId: string): Promise<Task> {
    const task = await this.findById(taskId);
    if (task.author?.id !== userId) {
      throw new ForbiddenException('Pouze autor může označit úkol jako splněný');
    }
    task.status = TaskStatus.FULFILLED;
    return this.taskRepo.save(task);
  }

  async findAllAdmin(): Promise<Task[]> {
    return this.taskRepo.find({ order: { createdAt: 'DESC' } });
  }
}
