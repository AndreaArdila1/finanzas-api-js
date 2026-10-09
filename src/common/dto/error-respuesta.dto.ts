import { ApiProperty } from '@nestjs/swagger';

export class ErrorRespuestaDto {
  @ApiProperty({ example: 400 })
  statusCode!: number;

  @ApiProperty({ example: '2026-09-04T15:30:00.000Z' })
  timestamp!: string;

  @ApiProperty({ example: '/transacciones' })
  path!: string;

  @ApiProperty({
    example: ['El monto debe ser positivo'],
    description: 'Uno o varios mensajes, según el tipo de error',
  })
  message!: string | string[];
}