import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { AuthModule } from '../auth/auth.module';
import * as path from 'path';
import * as fs from 'fs';


const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: uploadDir,
        filename: (req, file, cb) => {
          
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const ext = path.extname(file.originalname);
          cb(null, `${unique}${ext}`);
        },
      }),
      limits: {
        fileSize: 256 * 1024 * 1024, // 256MB
      },
    }),
    AuthModule,
  ],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}