import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTransaccionDto } from './dto/create-transaccion.dto.js';
import { UpdateTransaccionDto } from './dto/update-transaccion.dto.js';
import { FilterTransaccionDto } from './dto/filter-transaccion.dto.js';

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

  async obtenerMias(usuarioId: number, filtros: FilterTransaccionDto) {
    const { tipo, desde, hasta, pagina = 1, limite = 10 } = filtros;

    const where: Prisma.TransaccionWhereInput = {
      usuarioId,
      ...(tipo && { tipo }),
      ...(desde || hasta
        ? {
            fecha: {
              ...(desde && { gte: new Date(desde) }),
              ...(hasta && { lte: new Date(hasta) }),
            },
          }
        : {}),
    };

    const [datos, total] = await Promise.all([
      this.prisma.transaccion.findMany({
        where,
        include: { categoria: true },
        orderBy: { fecha: 'desc' },
        skip: (pagina - 1) * limite,
        take: limite,
      }),
      this.prisma.transaccion.count({ where }),
    ]);

    return {
      datos,
      meta: { pagina, limite, total, totalPaginas: Math.ceil(total / limite) },
    };
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

  async obtenerTodasAdminConFiltros(filtros: FilterTransaccionDto) {
    const { tipo, desde, hasta, pagina = 1, limite = 10 } = filtros;

    const where: Prisma.TransaccionWhereInput = {
      ...(tipo && { tipo }),
      ...(desde || hasta
        ? {
            fecha: {
              ...(desde && { gte: new Date(desde) }),
              ...(hasta && { lte: new Date(hasta) }),
            },
          }
        : {}),
    };

    const [datos, total] = await Promise.all([
      this.prisma.transaccion.findMany({
        where,
        include: {
          categoria: true,
          usuario: { select: { id: true, nombre: true, email: true } },
        },
        orderBy: { fecha: 'desc' },
        skip: (pagina - 1) * limite,
        take: limite,
      }),
      this.prisma.transaccion.count({ where }),
    ]);

    return {
      datos,
      meta: { pagina, limite, total, totalPaginas: Math.ceil(total / limite) },
    };
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