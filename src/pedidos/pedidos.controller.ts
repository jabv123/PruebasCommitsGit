import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { PedidoEntity } from './entities/pedido.entity';

@ApiTags('pedidos')
@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @ApiOperation({ summary: 'Crear un nuevo pedido' })
  @ApiResponse({ status: 201, type: PedidoEntity })
  @Post()
  async create(@Body() createPedidoDto: CreatePedidoDto) {
    return await this.pedidosService.create(createPedidoDto);
  }

  @ApiOperation({ summary: 'Obtener todos los pedidos' })
  @ApiResponse({ status: 200, type: [PedidoEntity] })
  @Get()
  async findAll() {
    return await this.pedidosService.findAll();
  }

  @ApiOperation({ summary: 'Obtener un pedido por ID' })
  @ApiResponse({ status: 200, type: PedidoEntity })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.pedidosService.findOne(+id);
  }

  @ApiOperation({ summary: 'Actualizar un pedido' })
  @ApiResponse({ status: 200, type: PedidoEntity })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePedidoDto: UpdatePedidoDto,
  ) {
    return await this.pedidosService.update(+id, updatePedidoDto);
  }

  @ApiOperation({ summary: 'Eliminar un pedido' })
  @ApiResponse({ status: 200 })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.pedidosService.remove(+id);
  }
}
