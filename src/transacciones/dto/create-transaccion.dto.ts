import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';
import { TipoTransaccion } from '../../generated/prisma/enums.js';

export enum TipoTransaccionDto {
  INGRESO = 'INGRESO',
  GASTO = 'GASTO',
}
export class CreateTransaccionDto {
  @IsString() @IsNotEmpty() descripcion!: string;
  @IsNumber() @IsPositive() monto!: number;
  @IsEnum(TipoTransaccion) tipo!: TipoTransaccion;
  @IsInt() categoriaId!: number;
}
