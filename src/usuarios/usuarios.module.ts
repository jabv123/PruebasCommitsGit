import { forwardRef, Module } from '@nestjs/common';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { Type } from 'class-transformer';
import { UserEntity } from './entities/usuario.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { RoleEntity } from 'src/modules/rol/entities/role.entitity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity]),
  // El controlador usa guards de auth; Auth a su vez necesita UsuarioService
  forwardRef(() => AuthModule)],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService],
})
export class UsuariosModule { }
