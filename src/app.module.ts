import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard} from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import {InjectRepository} from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { JobsModule } from './jobs/jobs.module';
import { HealthModule } from './health/health.module';
import { User } from './auth/user.entity';
import {Role} from './auth/roles.enum';
import * as bcrypt from 'bcrypt';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 15,
    }]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true, 
      }),
    }),
    TypeOrmModule.forFeature([User]),
    AuthModule,
    TasksModule,
    JobsModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  
  async onModuleInit() {
    const adminExists = await this.userRepository.findOne({ where: { email: 'admin@admin.com' }, });
    if (!adminExists) {
      const hashed = await bcrypt.hash('Admin123!', 10);
      const admin = this.userRepository.create({
        email: 'admin@admin.com',
        password: hashed,
        role: Role.ADMIN,
      });
      await this.userRepository.save(admin);
    }
  }
}