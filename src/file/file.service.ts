import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from '../entities/fileEntity';
import { createReadStream, unlinkSync } from 'fs';
import { join } from 'path';
import { Response } from 'express';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
  ) {}

  async uploadFile(file: Express.Multer.File, storagePath: string): Promise<File> {
    const newFile = new File();
    newFile.filename = file.filename;
    newFile.originalname = file.originalname;
    newFile.mimetype = file.mimetype;
    newFile.size = file.size;
    newFile.path = join(storagePath, file.filename);

    return this.fileRepository.save(newFile);
  }

  async getFileById(id: string): Promise<File | null> {
    return this.fileRepository.findOne({ where: { id } });
  }

  async downloadFile(id: string, res: Response): Promise<void> {
    const file = await this.getFileById(id);
    if (!file) {
      throw new Error('File not found');
    }

    const fileStream = createReadStream(file.path);
    res.set({
      'Content-Type': file.mimetype,
      'Content-Disposition': `attachment; filename="${file.originalname}"`,
      'Content-Length': file.size,
    });

    fileStream.pipe(res);
  }

  async deleteFile(id: string): Promise<void> {
    const file = await this.getFileById(id);
    if (!file) {
      throw new Error('File not found');
    }
    try {
      unlinkSync(file.path);
    } catch (err) {
      console.error('Error deleting file:', err);
    }
    await this.fileRepository.delete(id);
  }

  async getAllFiles(): Promise<File[]> {
    return this.fileRepository.find();
  }
}