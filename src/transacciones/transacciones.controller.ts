import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { TransaccionesService } from './transacciones.service.js';
import { CreateTransaccionDto } from './dto/create-transaccion.dto.js';
import { UpdateTransaccionDto } from './dto/update-transaccion.dto.js';
import { FilterTransaccionDto } from './dto/filter-transaccion.dto.js';
import { TipoTransaccionDto } from './dto/create-transaccion.dto.js';
import { UsuarioActual } from '../auth/usuario-actual.decorator.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { Rol } from '../generated/prisma/client.js';
import { ErrorRespuestaDto } from '../common/dto/error-respuesta.dto.js';

@ApiTags('transacciones')
@ApiBearerAuth()
@ApiResponse({ status: 401, description: 'No autenticado', type: ErrorRespuestaDto })
// El decorador @UseGuards(JwtAuthGuard) se utiliza para proteger las rutas del controlador TransaccionesController.
// Esto significa que todas las rutas definidas en este controlador requerirán autenticación mediante JWT (JSON Web Token) para poder acceder a ellas.
// El guardia JwtAuthGuard interceptará las solicitudes entrantes y verificará si el token JWT proporcionado es válido antes de permitir el acceso a las rutas del controlador.
@UseGuards(JwtAuthGuard)
@Controller('transacciones')
export class TransaccionesController {
  constructor(private readonly transaccionesService: TransaccionesService) {}

  @Post()
  crear(
    @Body() dto: CreateTransaccionDto,
    // El decorador @UsuarioActual() se utiliza para inyectar el usuario autenticado en el controlador. 
    // Este decorador extrae la información del usuario del token JWT presente en la solicitud y la pasa como argumento al método del controlador. 
    // Esto permite que el controlador acceda a los datos del usuario autenticado, como su ID, sin necesidad de realizar consultas adicionales a la base de datos.
    @UsuarioActual() usuario: { id: number },
  ) {
    return this.transaccionesService.crear(dto, usuario.id);
  }

  @Get()
  @ApiQuery({ name: 'tipo', required: false, enum: TipoTransaccionDto })
  @ApiQuery({ name: 'desde', required: false, example: '2026-01-01' })
  @ApiQuery({ name: 'hasta', required: false, example: '2026-01-31' })
  @ApiQuery({ name: 'pagina', required: false, example: 1 })
  @ApiQuery({ name: 'limite', required: false, example: 10 })
  obtenerMias(
    @Query() filtros: FilterTransaccionDto,
    @UsuarioActual() usuario: { id: number },
  ) {
    return this.transaccionesService.obtenerMias(usuario.id, filtros);
  }

  @Get('admin/todas')
  @UseGuards(RolesGuard)
  @Roles([Rol.ADMIN])
  @ApiQuery({ name: 'tipo', required: false, enum: TipoTransaccionDto })
  @ApiQuery({ name: 'desde', required: false, example: '2026-01-01' })
  @ApiQuery({ name: 'hasta', required: false, example: '2026-01-31' })
  @ApiQuery({ name: 'pagina', required: false, example: 1 })
  @ApiQuery({ name: 'limite', required: false, example: 10 })
  obtenerTodasAdmin(@Query() filtros: FilterTransaccionDto) {
    return this.transaccionesService.obtenerTodasAdminConFiltros(filtros);
  }

  @Get(':id')
  obtenerUna(
    @Param('id', ParseIntPipe) id: number,
    @UsuarioActual() usuario: { id: number },
  ) {
    return this.transaccionesService.obtenerUna(id, usuario.id);
  }

  @Patch(':id')
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTransaccionDto,
    @UsuarioActual() usuario: { id: number },
  ) {
    return this.transaccionesService.actualizar(id, dto, usuario.id);
  }

  @Delete(':id')
  eliminar(
    @Param('id', ParseIntPipe) id: number,
    @UsuarioActual() usuario: { id: number },
  ) {
    return this.transaccionesService.eliminar(id, usuario.id);
  }
}
