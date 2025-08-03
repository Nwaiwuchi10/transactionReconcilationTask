import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { FileInterceptor } from '@nestjs/platform-express';

import { writeFile } from 'fs/promises';
import { join } from 'path';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}
  @Post('upload/:system')
  @UseInterceptors(FileInterceptor('file'))
  async uploadTransactions(
    @UploadedFile() file: Express.Multer.File,
    @Param('system') system: 'A' | 'B',
  ) {
    if (!file) {
      throw new BadRequestException('File not provided');
    }

    // Save to FileUploads directory
    const filePath = join(process.cwd(), 'FileUploads', file.originalname);
    await writeFile(filePath, file.buffer);

    // Continue parsing and storing in DB
    return this.transactionsService.parseAndStoreCSV(file.buffer, system);
  }
  @Get()
  async getTransactions(
    @Query('source') source?: 'A' | 'B',
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.transactionsService.getPaginatedTransactions(
      source,
      +page,
      +limit,
    );
  }
  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(createTransactionDto);
  }

  @Get()
  findAll() {
    return this.transactionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(+id, updateTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionsService.remove(+id);
  }
}
