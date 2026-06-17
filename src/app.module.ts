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
  try {
    const adminExists = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email: 'admin@admin.com' })
      .getOne();

    if (!adminExists) {
      const hashed = await bcrypt.hash('Admin123!', 10);
      const admin = this.userRepository.create({
        email: 'admin@admin.com',
        password: hashed,
        role: Role.ADMIN,
      });
      await this.userRepository.save(admin);
      console.log('Admin created');
    }
  } catch (error:unknown) {
    console.error('Admin seed error:', (error as Error).message);
  }
}
}
// Previously used findOne() but it conflicted with select:false on password field.
// When admin already existed, it threw a duplicate key error and crashed the app.
// Solved by wrapping in try/catch and using createQueryBuilder to bypass select:false issue.

//   async onModuleInit() {
//     const adminExists = await this.userRepository.findOne({ where: { email: 'admin@admin.com' }, }); 
//     if (!adminExists) {
//       const hashed = await bcrypt.hash('Admin123!', 10);
//       const admin = this.userRepository.create({
//         email: 'admin@admin.com',
//         password: hashed,
//         role: Role.ADMIN,
//       });
//       await this.userRepository.save(admin);
//     }
//   }
// }