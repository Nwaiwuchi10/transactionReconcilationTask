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
import { ReconciliationService } from './reconciliation.service';
import { CreateReconciliationDto } from './dto/create-reconciliation.dto';
import { UpdateReconciliationDto } from './dto/update-reconciliation.dto';

@Controller('reconciliation')
export class ReconciliationController {
  constructor(private readonly reconciliationService: ReconciliationService) {}

  @Post()
  async reconcile(@Body('uploadedBy') uploadedBy: string) {
    const report = await this.reconciliationService.reconcile(uploadedBy);
    return {
      message: 'Reconciliation completed',
      report,
    };
  }
  @Get()
  async getReports(@Query('page') page = 1, @Query('limit') limit = 10) {
    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const result = await this.reconciliationService.getReports(
      pageNumber,
      limitNumber,
    );
    return result;
  }
  @Post('/new')
  create(@Body() createReconciliationDto: CreateReconciliationDto) {
    return this.reconciliationService.create(createReconciliationDto);
  }

  @Get()
  findAll() {
    return this.reconciliationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reconciliationService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateReconciliationDto: UpdateReconciliationDto,
  ) {
    return this.reconciliationService.update(+id, updateReconciliationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reconciliationService.remove(+id);
  }
}
