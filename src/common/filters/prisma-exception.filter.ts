import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import type { Response } from "express";
import { Prisma } from "../../generated/prisma/client.js";

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {

    const response = host.switchToHttp().getResponse<Response>();

    const codigos: Record<string, number> = {
      P2025: HttpStatus.NOT_FOUND,
      P2002: HttpStatus.CONFLICT,
      P2003: HttpStatus.BAD_REQUEST,
    };

    const status = codigos[exception.code] ?? HttpStatus.INTERNAL_SERVER_ERROR;
    
    response.status(status).json({
      statusCode: status, codigoPrisma: exception.code,
      mensaje: 'Error al procesar la operación en base de datos',
    });
  }
}