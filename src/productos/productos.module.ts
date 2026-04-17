import { Module } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoEntity } from './entities/producto.entity';
import { InventarioEntity } from 'src/inventario/entities/inventario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductoEntity, InventarioEntity])],
  providers: [ProductosService],
  controllers: [ProductosController],
  exports: [ProductosService],
})
export class ProductosModule {}
