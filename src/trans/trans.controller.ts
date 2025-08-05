import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TransService } from './trans.service';
import { CreateTranDto, TransactionPayDto } from './dto/create-tran.dto';
import { UpdateTranDto } from './dto/update-tran.dto';

@Controller('trans')
export class TransController {
  constructor(private readonly transService: TransService) {}

  @Post()
  async handleTransaction(@Body() txDto: TransactionPayDto) {
    await this.transService.processTransaction({
      ...txDto,
      timestamp: new Date(txDto.timestamp),
    } as any); // cast to TransactionPay or use conversion
    return { message: 'Transaction processed successfully' };
  }

  @Get('/fraud-check')
  async getFlaggedTransactions(@Query('userId') userId: string) {
    if (!userId) {
      return { error: 'userId is required' };
    }

    const flagged =
      await this.transService.getFlaggedTransactionsByUser(userId);
    return { userId, flagged };
  }
  @Post()
  create(@Body() createTranDto: CreateTranDto) {
    return this.transService.create(createTranDto);
  }

  @Get()
  findAll() {
    return this.transService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTranDto: UpdateTranDto) {
    return this.transService.update(+id, updateTranDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transService.remove(+id);
  }
}
