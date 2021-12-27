import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { UpdateDateColumn } from 'typeorm';

@Entity('roles')
export class Role extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    public id: number;

    @Column({ type: 'varchar', length: 20, nullable: false })
    public name: string;

    @Column({ type: 'text', nullable: false })
    public description: string;

    @ManyToMany(() => User, (user) => user.roles)
    public users: User[];

    @Column({ type: 'varchar', default: 'ACTIVE', length: 8 })
    public status: string;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    public createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    public updatedAt: Date;
}
