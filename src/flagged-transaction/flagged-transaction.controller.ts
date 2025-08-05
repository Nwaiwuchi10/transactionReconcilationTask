import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FlaggedTransactionService } from './flagged-transaction.service';
import { CreateFlaggedTransactionDto } from './dto/create-flagged-transaction.dto';
import { UpdateFlaggedTransactionDto } from './dto/update-flagged-transaction.dto';

@Controller('flagged-transaction')
export class FlaggedTransactionController {
  constructor(private readonly flaggedTransactionService: FlaggedTransactionService) {}

  @Post()
  create(@Body() createFlaggedTransactionDto: CreateFlaggedTransactionDto) {
    return this.flaggedTransactionService.create(createFlaggedTransactionDto);
  }

  @Get()
  findAll() {
    return this.flaggedTransactionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.flaggedTransactionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFlaggedTransactionDto: UpdateFlaggedTransactionDto) {
    return this.flaggedTransactionService.update(+id, updateFlaggedTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.flaggedTransactionService.remove(+id);
  }
}
