import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
//import { InjectRepository } from '@nestjs/typeorm';
//import { Repository } from 'typeorm';
import { JwtService } from './jwt.service';
//import { User } from './user.entity';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    // @InjectRepository(User)
    // private userRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.split(' ')[1];

    const user = await this.jwtService.validateUser(token);

    // const payload = this.jwtService.verify(token);


    // const user = await this.userRepository.findOne({
    //   where: { id: payload.sub as string },
    //   select: {
    //     id: true,
    //     email: true,
    //     role: true,
    //     createdAt: true,
    //     updatedAt: true,
    //   },
    // });

    // if (!user) throw new UnauthorizedException('User not found');

    request.user = user;
    return true;
  }
}