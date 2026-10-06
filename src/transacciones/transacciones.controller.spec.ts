import { Test, TestingModule } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { TransaccionesController } from './transacciones.controller.js';
import { TransaccionesService } from './transacciones.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('TransaccionesController', () => {
  let controller: TransaccionesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [TransaccionesController],
      providers: [
        TransaccionesService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    controller = module.get<TransaccionesController>(TransaccionesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
