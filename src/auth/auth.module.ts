import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { JwtStrategy } from './jwt.strategy.js';

@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // El método JwtModule.register() se utiliza para configurar el módulo JWT en NestJS.
    // Este método permite establecer opciones de configuración, como la clave secreta utilizada para firmar los tokens JWT y el tiempo de expiración de los tokens. 
    // Al registrar el módulo con estas opciones, se habilita la funcionalidad de autenticación basada en JWT en la aplicación, permitiendo generar y verificar tokens de manera segura.
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: (process.env.JWT_EXPIRES_IN ?? '1h') as '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule, PassportModule],
})
export class AuthModule {}