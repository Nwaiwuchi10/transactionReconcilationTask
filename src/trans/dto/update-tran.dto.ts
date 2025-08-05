import { PartialType } from '@nestjs/mapped-types';
import { CreateTranDto } from './create-tran.dto';

export class UpdateTranDto extends PartialType(CreateTranDto) {}
