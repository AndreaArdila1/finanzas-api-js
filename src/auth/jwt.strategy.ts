import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Rol } from '../generated/prisma/client.js';

type JwtPayload = { sub: number; email: string; rol: Rol };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    // Obtener la clave secreta desde las variables de entorno
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        // Lanzar una excepción si la variable de entorno JWT_SECRET no está definida
      throw new UnauthorizedException('JWT_SECRET no está definida');
    }
    // super() se utiliza para llamar al constructor de la clase base PassportStrategy, pasando la configuración necesaria para la estrategia JWT. Esto incluye cómo extraer el token JWT de la solicitud (en este caso, desde el encabezado de autorización como un token Bearer), si se debe ignorar la expiración del token y la clave secreta utilizada para verificar la firma del token.
    super({
      // Configuración de la estrategia JWT
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  validate(payload: JwtPayload) {
    return { id: payload.sub, email: payload.email, rol: payload.rol };
  }
}