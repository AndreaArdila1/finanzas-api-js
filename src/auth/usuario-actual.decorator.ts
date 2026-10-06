import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Rol } from '../generated/prisma/client.js';

/**
 * UsuarioActual es un decorador personalizado que se utiliza para extraer la información del usuario autenticado de la solicitud HTTP en los controladores de NestJS. Este decorador permite acceder fácilmente a los datos del usuario (como id y email) que han sido validados y añadidos al objeto de solicitud por la estrategia de autenticación JWT.
 * 
 * @param _data - Datos adicionales que se pueden pasar al decorador (no se utiliza en este caso).
 * @param ctx - El contexto de ejecución que proporciona acceso a la solicitud HTTP.
 * @returns Un objeto que contiene el id y el email del usuario autenticado.
 */
export const UsuarioActual = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as { id: number; email: string; rol: Rol };
  },
);