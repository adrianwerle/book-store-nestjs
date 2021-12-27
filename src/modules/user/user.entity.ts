import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { UserDetails } from './user.details.entity';
import { Role } from '../role/role.entity';
import { Book } from '../book/book.entity';

@Entity('users')
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    public id: number;

    @Column({ type: 'varchar', unique: true, length: 25, nullable: false })
    public username: string;

    @Column({ type: 'varchar', nullable: false })
    public email: string;

    @Column({ type: 'varchar', nullable: false })
    public password: string;

    @OneToOne(() => UserDetails, {
        cascade: true,
        nullable: false,
        eager: true,
    })
    @JoinColumn({ name: 'detail_id' })
    public details: UserDetails;

    @ManyToMany(() => Role, (role) => role.users, { eager: true })
    @JoinTable({ name: 'user_roles' })
    public roles: Role[];

    @ManyToMany(() => Book, (book) => book.authors)
    @JoinTable({ name: 'user_books' })
    public books: Book[];

    @Column({ type: 'varchar', default: 'ACTIVE', length: 8 })
    public status: string;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    public createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    public updatedAt: Date;
}
