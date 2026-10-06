import { Reflector } from '@nestjs/core';
import { Rol } from '../generated/prisma/client.js';

// reflector.createDecorator<Rol[]>() es un método proporcionado por el módulo @nestjs/core que permite crear un decorador personalizado en NestJS. 
// En este caso, se está creando un decorador llamado Roles que se utilizará para asociar roles específicos a los controladores o métodos de los controladores. 
// Este decorador puede ser utilizado para implementar la autorización basada en roles, permitiendo que solo los usuarios con ciertos roles puedan acceder a determinados recursos o funcionalidades de la aplicación.
export const Roles = Reflector.createDecorator<Rol[]>();