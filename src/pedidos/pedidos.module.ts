import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PedidosService } from './pedidos.service';
import { PedidosController } from './pedidos.controller';
import { PedidoEntity } from './entities/pedido.entity';
import { ProductoEntity } from 'src/productos/entities/producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PedidoEntity, ProductoEntity])],
  controllers: [PedidosController],
  providers: [PedidosService],
  exports: [PedidosService],
})
export class PedidosModule {}
