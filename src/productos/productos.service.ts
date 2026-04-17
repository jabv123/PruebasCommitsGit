import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductoEntity } from './entities/producto.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import {
  ProductoFullResponseDto,
  ProductoDetalleDto,
} from './dto/producto-full.dto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,
  ) {}

  async findAll(): Promise<ProductoEntity[]> {
    const productos = await this.productoRepository.find({
      relations: ['categorias'],
    });
    return productos;
  }

  async findOne(id: number): Promise<ProductoEntity> {
    const producto = await this.productoRepository.findOne({
      where: { id },
      relations: ['categorias'],
    });
    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return producto;
  }

  async create(createProductDto: CreateProductDto): Promise<ProductoEntity> {
    const producto = this.productoRepository.create({
      nombre: createProductDto.nombre,
      precio: createProductDto.precio,
      categoriaId: createProductDto.categoriaId,
    });
    return await this.productoRepository.save(producto);
  }

  async findWhitPagination(
    page: number,
    limit: number,
  ): Promise<ProductoEntity[]> {
    const productos = await this.productoRepository.find({
      skip: (page - 1) * limit,
      take: limit,
      order: { nombre: 'ASC' },
      relations: ['categorias'],
    });
    return productos;
  }

  async searchByName(name: string): Promise<ProductoEntity[]> {
    const productos = await this.productoRepository
      .createQueryBuilder('producto')
      .where('LOWER(producto.nombre) LIKE :name', {
        name: `%${name.toLowerCase()}%`,
      })
      .leftJoinAndSelect('producto.categorias', 'categoria')
      .getMany();
    return productos;
  }

  async searchv2ByName(name: string): Promise<ProductoEntity[]> {
    const productos = await this.productoRepository.find({
      where: { nombre: name },
      relations: ['categorias'],
    });
    return productos;
  }

  // Función para listar productos con su categoría e inventario, aplicando reglas de negocio como calcular el valor total del inventario y clasificar el estado del stock
  async findProductosConCategoriaEInventario(): Promise<ProductoFullResponseDto> {
    const productos = await this.productoRepository
      .createQueryBuilder('producto')
      .leftJoinAndSelect('producto.categorias', 'categoria')
      .leftJoinAndSelect('producto.inventario', 'inventario')
      .orderBy('producto.nombre', 'ASC')
      .getMany();

    const detalles = productos.map((item) => this.mapProductoDetalle(item));
    return this.buildResumenProducto(detalles);
  }

  // Refactor de la función anterior, separando la lógica de negocio en funciones privadas para mejorar la legibilidad y mantenibilidad del código
  async findProductosConCategoriaEInventarioRefactor(): Promise<ProductoFullResponseDto> {
    const productos = await this.findProductosEnBaseDeDatos();
    const detalles = productos.map((item) => this.mapProductoDetalle(item));
    return this.buildResumenProducto(detalles);
  }

  // Función privada para obtener productos con relaciones y aplicar filtros básicos desde la base de datos, dejando la lógica de negocio para funciones privadas posteriores
  private async findProductosEnBaseDeDatos(): Promise<ProductoEntity[]> {
    return this.productoRepository
      .createQueryBuilder('producto')
      .leftJoinAndSelect('producto.categorias', 'categoria')
      .leftJoinAndSelect('producto.inventario', 'inventario')
      .where('producto.precio > :precioMin', { precioMin: 0 })
      .getMany();
  }

  // Función privada para mapear ProductoEntity a ProductoDetalleDto con reglas de negocio
  private mapProductoDetalle(producto: ProductoEntity): ProductoDetalleDto {
    const stock = producto.inventario?.stock ?? 0;
    const valorTotalInventario = Number(producto.precio) * stock;
    const estadoStock = this.calcularEstadoStock(stock);

    return {
      id: producto.id,
      nombre: producto.nombre,
      precio: Number(producto.precio),
      categoria: producto.categorias,
      inventario: producto.inventario,
      valorTotalInventario,
      tieneStock: stock > 0,
      estadoStock,
    };
  }

  private calcularEstadoStock(stock: number): string {
    if (stock === 0) {
      return 'AGOTADO';
    }
    if (stock <= 5) {
      return 'BAJO';
    }
    if (stock <= 15) {
      return 'NORMAL';
    }
    return 'EXCESIVO';
  }

  private buildResumenProducto(
    detalles: ProductoDetalleDto[],
  ): ProductoFullResponseDto {
    const totalProductos = detalles.length;
    const totalStock = detalles.reduce(
      (sum, item) => sum + (item.inventario?.stock ?? 0),
      0,
    );
    const totalValorInventario = detalles.reduce(
      (sum, item) => sum + item.valorTotalInventario,
      0,
    );

    return {
      totalProductos,
      totalStock,
      totalValorInventario,
      productos: detalles,
    };
  }
}
