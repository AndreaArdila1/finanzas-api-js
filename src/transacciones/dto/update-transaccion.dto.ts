import { PartialType } from '@nestjs/swagger';
import { CreateTransaccionDto } from './create-transaccion.dto.js';

export class UpdateTransaccionDto extends PartialType(CreateTransaccionDto) {}
