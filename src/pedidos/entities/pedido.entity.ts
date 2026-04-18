import { UserEntity } from 'src/usuarios/entities/usuario.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn, CreateDateColumn } from 'typeorm';

@Entity({ name: 'pedidos' })
export class PedidoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  usuarioId: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'usuarioId' })
  usuario: UserEntity;

  @CreateDateColumn({ type: 'timestamp', name: 'fecha_pedido' })
  fechaPedido: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @Column({ type: 'varchar', length: 50, default: 'pendiente' })
  estado: string;
}
