import { User as UserEntity} from '../auth/user.entity';

declare module 'fastify' {
  interface FastifyRequest {
    user?: UserEntity;
  }
}