import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  Max,
  Min,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TipoTransaccionDto } from './create-transaccion.dto.js';

@ValidatorConstraint({ name: 'RangoDeFechasValido', async: false })
class RangoDeFechasValidoConstraint implements ValidatorConstraintInterface {
  validate(hasta: string | undefined, args: ValidationArguments) {
    const dto = args.object as FilterTransaccionDto;
    if (!dto.desde || !hasta) {
      return true;
    }
    return new Date(hasta) >= new Date(dto.desde);
  }

  defaultMessage() {
    return 'La fecha "hasta" no puede ser anterior a la fecha "desde"';
  }
}

export class FilterTransaccionDto {
  @ApiPropertyOptional({ enum: TipoTransaccionDto })
  @IsOptional()
  @IsEnum(TipoTransaccionDto, { message: 'El tipo debe ser INGRESO o GASTO' })
  tipo?: TipoTransaccionDto;

  @ApiPropertyOptional({ example: '2026-01-01' })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha "desde" debe tener formato AAAA-MM-DD' })
  desde?: string;

  @ApiPropertyOptional({ example: '2026-01-31' })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha "hasta" debe tener formato AAAA-MM-DD' })
  @Validate(RangoDeFechasValidoConstraint)
  hasta?: string;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'La página debe ser un número entero' })
  @Min(1, { message: 'La página debe ser al menos 1' })
  pagina?: number = 1;

  @ApiPropertyOptional({ example: 10, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El límite debe ser un número entero' })
  @Min(1, { message: 'El límite debe ser al menos 1' })
  @Max(50, { message: 'El límite no puede superar 50' })
  limite?: number = 10;
}