import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PedidoEntity } from './entities/pedido.entity';
import { ProductoEntity } from 'src/productos/entities/producto.entity';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';

@Injectable()
export class PedidosService {
  constructor(
    @InjectRepository(PedidoEntity)
    private readonly pedidoRepository: Repository<PedidoEntity>,
    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,
  ) {}

  async create(createPedidoDto: CreatePedidoDto): Promise<PedidoEntity> {
    // Verificar que los productos existen
    const productos = await this.productoRepository.findByIds(
      createPedidoDto.productosIds,
    );
    if (productos.length !== createPedidoDto.productosIds.length) {
      throw new BadRequestException('Algunos productos no existen');
    }

    // Calcular total
    const total = productos.reduce((sum, producto) => sum + producto.precio, 0);

    const pedido = this.pedidoRepository.create({
      usuarioId: createPedidoDto.usuarioId,
      total,
    });

    return await this.pedidoRepository.save(pedido);
  }

  async findAll(): Promise<PedidoEntity[]> {
    return await this.pedidoRepository.find({
      relations: ['usuario'],
    });
  }

  async findOne(id: number): Promise<PedidoEntity> {
    const pedido = await this.pedidoRepository.findOne({
      where: { id },
      relations: ['usuario'],
    });
    if (!pedido) {
      throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
    }
    return pedido;
  }

  async update(
    id: number,
    updatePedidoDto: UpdatePedidoDto,
  ): Promise<PedidoEntity> {
    const pedido = await this.findOne(id);

    if (updatePedidoDto.usuarioId) {
      pedido.usuarioId = updatePedidoDto.usuarioId;
    }

    if (updatePedidoDto.productosIds) {
      const productos = await this.productoRepository.findByIds(
        updatePedidoDto.productosIds,
      );
      if (productos.length !== updatePedidoDto.productosIds.length) {
        throw new BadRequestException('Algunos productos no existen');
      }
      pedido.total = productos.reduce(
        (sum, producto) => sum + producto.precio,
        0,
      );
    }

    if (updatePedidoDto.estado) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      pedido.estado = updatePedidoDto.estado;
    }

    return await this.pedidoRepository.save(pedido);
  }

  async remove(id: number): Promise<void> {
    const pedido = await this.findOne(id);
    await this.pedidoRepository.remove(pedido);
  }
}
