import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTransaccionDto } from './dto/create-transaccion.dto.js';
import { UpdateTransaccionDto } from './dto/update-transaccion.dto.js';

@Injectable()
export class TransaccionesService {
  constructor(private readonly prisma: PrismaService) {}

  crear(dto: CreateTransaccionDto, usuarioId: number) {
    return this.prisma.transaccion.create({
      data: {
        descripcion: dto.descripcion,
        monto: dto.monto,
        tipo: dto.tipo,
        categoriaId: dto.categoriaId,
        usuarioId,
      },
      include: { categoria: true },
    });
  }

  obtenerMias(usuarioId: number) {
    return this.prisma.transaccion.findMany({
      where: { usuarioId },
      include: { categoria: true },
      orderBy: { id: 'asc' },
    });
  }

  obtenerTodasAdmin() {
    return this.prisma.transaccion.findMany({
      include: {
        categoria: true,
        usuario: { select: { id: true, nombre: true, email: true } },
      },
      orderBy: { id: 'asc' },
    });
  }

  async obtenerUna(id: number, usuarioId: number) {
    const transaccion = await this.prisma.transaccion.findUnique({
      where: { id },
      include: { categoria: true },
    });

    if (!transaccion) {
      throw new NotFoundException('La transacción no existe');
    }

    if (transaccion.usuarioId !== usuarioId) {
      throw new ForbiddenException('Esta transacción no es tuya');
    }

    return transaccion;
  }

  async actualizar(
    id: number,
    dto: UpdateTransaccionDto,
    usuarioId: number,
  ) {
    await this.obtenerUna(id, usuarioId);
    return this.prisma.transaccion.update({
      where: { id },
      data: dto,
      include: { categoria: true },
    });
  }

  async eliminar(id: number, usuarioId: number) {
    await this.obtenerUna(id, usuarioId);
    return this.prisma.transaccion.delete({ where: { id } });
  }
}