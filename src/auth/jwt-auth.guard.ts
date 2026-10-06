import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JwtAuthGuard es un guardia de autenticación personalizado que extiende la funcionalidad del AuthGuard proporcionado por 
 * Passport.js para manejar la autenticación basada en JWT (JSON Web Token) en aplicaciones NestJS. 
 * Este guardia intercepta las solicitudes entrantes y verifica si contienen un token JWT válido en el encabezado de autorización. 
 * Si el token es válido, permite que la solicitud continúe; de lo contrario, bloquea el acceso y devuelve un error de autenticación.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}