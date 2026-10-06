import { Test, TestingModule } from '@nestjs/testing';
import { TransaccionesService } from './transacciones.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('TransaccionesService', () => {
  let service: TransaccionesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransaccionesService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<TransaccionesService>(TransaccionesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
