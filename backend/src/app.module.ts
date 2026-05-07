import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { MailModule } from './mail/mail.module';
import { AdminModule } from './admin/admin.module';
import { User } from './users/user.entity';
import { Task } from './tasks/task.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT) || 5432,
      username: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'postgres',
      database: process.env.DATABASE_NAME || 'pomoc_ted',
      entities: [User, Task],
      synchronize: process.env.NODE_ENV !== 'production', // use migrations in production
    }),
    AuthModule,
    UsersModule,
    TasksModule,
    MailModule,
    AdminModule,
  ],
})
export class AppModule {}
