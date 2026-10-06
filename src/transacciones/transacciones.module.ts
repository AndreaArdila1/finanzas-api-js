import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TransaccionesService } from './transacciones.service.js';
import { TransaccionesController } from './transacciones.controller.js';

@Module({
  imports: [PassportModule],
  controllers: [TransaccionesController],
  providers: [TransaccionesService],
})
export class TransaccionesModule {}
