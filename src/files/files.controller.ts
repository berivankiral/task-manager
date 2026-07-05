import {
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiCookieAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FilesService } from './files.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../auth/user.entity';
import { FastifyRequest } from 'fastify';
import * as path from 'path';
import * as fs from 'fs';
import { pipeline } from 'stream/promises';
import * as crypto from 'crypto';

@ApiTags('Files')
@ApiBearerAuth()
@ApiCookieAuth()
@UseGuards(JwtAuthGuard)
@Controller('files')
export class FilesController {
  constructor(private filesService: FilesService) {}

  @ApiOperation({ summary: 'Upload a file (max 256MB)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @Post('upload')
  async uploadFile(@Request() req: FastifyRequest & { user: User }) {

    const uploadDir = /.uploads/;
    if (!fs.existsSync('./uploads')) {
      fs.mkdirSync('./uploads', { recursive: true });
    }

    const data = await req.file( );

    if (!data) throw new BadRequestException('No file provided');

    const unique = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;
    const ext = path.extname(data.filename);
    const filename = `${unique}${ext}`;
    const uploadPath = path.join('./uploads', filename);

    await pipeline(data.file, fs.createWriteStream(uploadPath));

    
    const originalname = Buffer.from(data.filename, 'latin1').toString('utf8');

    return this.filesService.uploadFile({
      filename,
      originalname,
      size: data.file.bytesRead,
      mimetype: data.mimetype,
    }, req.user.id);
  }

  @ApiOperation({ summary: 'Get file info' })
  @Get(':filename')
  getFileInfo(@Param('filename') filename: string) {
    return this.filesService.getFileInfo(filename);
  }
}