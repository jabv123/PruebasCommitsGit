import { Exclude } from "class-transformer";
import { RoleEntity } from "src/modules/rol/entities/role.entitity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 100, unique: true})
    username: string;

    @Column({type: 'varchar', length: 255, unique: true})
    email: string;

    @Column({type: 'varchar', length: 255})
    // 
    @Exclude({toPlainOnly: true})
    password: string;
    
    @Column()
    roleId: number;

    @ManyToOne(() => RoleEntity, role => role.users)
    @JoinColumn({name: 'roleId'})
    role: RoleEntity;
}