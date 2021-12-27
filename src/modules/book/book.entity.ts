import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity('books')
export class Book extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    public id: number;

    @Column({ type: 'varchar', length: 100, nullable: false })
    public name: string;

    @Column({ type: 'varchar', length: 500, nullable: true })
    public description: string;

    @ManyToMany(() => User, (user) => user.books, { eager: true })
    public authors: User[];

    @Column({ type: 'varchar', default: 'ACTIVE', length: 8 })
    public status: string;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    public createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    public updatedAt: Date;
}
