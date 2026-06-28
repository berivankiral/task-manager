import { Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {
  uploadFile(file: Express.Multer.File, userId: string) {
    return {
      message: 'File uploaded successfully',
      filename: file.filename,
      originalname: Buffer.from(file.originalname, 'latin1').toString('utf8'),
      size: file.size,
      mimetype: file.mimetype,
      uploadedBy: userId,
    };
  }

  getFileInfo(filename: string) {
    return {
      filename,
      url: `/files/${filename}`,
    };
  }
}