import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto.js';
import { UpdateCategoriaDto} from './dto/update-categoria.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class CategoriasService {

  constructor(private readonly prisma: PrismaService) {}

  // Este método crea una nueva categoría en la base de datos utilizando los datos proporcionados en el DTO.
  // async se utiliza para declarar que la función es asíncrona y puede contener operaciones que devuelven promesas.
  // await se utiliza para esperar a que la promesa devuelta por create se resuelva antes de continuar con la ejecución del código.
  async create(dto: CreateCategoriaDto) { 
    return this.prisma.categoria.create({ data: dto }); 
  }

  // Este método devuelve todas las categorías almacenadas en la base de datos.
  async findAll() { 
    return this.prisma.categoria.findMany(); 
  }

  // Este método busca una categoría por su ID. Si no se encuentra, lanza una excepción NotFoundException.
  async findOne(id: number) {
    const categoria = await this.prisma.categoria.findUnique({ where: { id } });
    if (!categoria) throw new NotFoundException(`La categoría ${id} no existe`);
    return categoria;
  }

  // Este método actualiza una categoría por su ID. Si no se encuentra, lanza una excepción NotFoundException.
  async update(id: number, dto: UpdateCategoriaDto) {
    const _categoria = await this.findOne(id);
    return this.prisma.categoria.update({ where: { id }, data: dto });
  }

  // Este método elimina una categoría por su ID. Si no se encuentra, lanza una excepción NotFoundException.
  async remove(id: number) {
    const _categoria = await this.findOne(id);
    return this.prisma.categoria.delete({ where: { id } });
  }
}