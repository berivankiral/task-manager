import { User } from '../auth/user.entity';

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      role: string;
      createdAt: Date;
      updatedAt: Date;
      password: string;
    }
  }
}
export {};