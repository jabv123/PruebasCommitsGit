import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductosService } from './productos.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductoFullResponseDto } from './dto/producto-full.dto';

@ApiTags('productos')
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  // @Get()
  // async findAll() {
  //     return await this.productosService.findAll();
  // }

  @ApiOperation({ summary: 'Crear un nuevo producto' })
  @ApiOkResponse({ type: Object })
  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productosService.create(createProductDto);
  }

  @ApiOperation({
    summary: 'Listar productos con categoría e inventario y reglas de negocio',
  })
  @ApiOkResponse({ type: ProductoFullResponseDto })
  @Get('dashboard')
  async findProductosConCategoriaEInventario() {
    return await this.productosService.findProductosConCategoriaEInventario();
  }

  @ApiOperation({
    summary:
      'Misma consulta que dashboard, pero refactor usando funciones privadas',
  })
  @ApiOkResponse({ type: ProductoFullResponseDto })
  @Get('dashboard-refactor')
  async findProductosConCategoriaEInventarioRefactor() {
    return await this.productosService.findProductosConCategoriaEInventarioRefactor();
  }

  @Get('pagination')
  async findWhitPagination(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return await this.productosService.findWhitPagination(+page, +limit);
  }

  @Get('search')
  async searchByName(@Query('name') name: string) {
    return await this.productosService.searchByName(name);
  }
}
