import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsArray, IsNotEmpty } from 'class-validator';

export class CreatePedidoDto {
  @ApiProperty({ description: 'ID del usuario que realiza el pedido', example: 1 })
  @IsNumber({}, { message: 'El ID del usuario debe ser un número' })
  @IsPositive({ message: 'El ID del usuario debe ser un número positivo' })
  @IsNotEmpty({ message: 'El ID del usuario es obligatorio' })
  usuarioId: number;

  @ApiProperty({
    description: 'Lista de IDs de productos en el pedido',
    example: [1, 2, 3],
    type: [Number],
  })
  @IsArray({ message: 'Los productos deben ser un arreglo de números' })
  @IsNumber({}, { each: true, message: 'Cada ID de producto debe ser un número' })
  @IsNotEmpty({ message: 'La lista de productos es obligatoria' })
  productosIds: number[];
}
