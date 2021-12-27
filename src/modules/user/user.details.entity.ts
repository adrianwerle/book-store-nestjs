import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('user_details')
export class UserDetails extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    public id: number;

    @Column({ type: 'varchar', length: 50, nullable: true })
    public name: string;

    @Column({ type: 'varchar', nullable: true })
    public lastname: string;

    @Column({ type: 'varchar', default: 'ACTIVE', length: 8 })
    public status: string;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    public createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    public updatedAt: Date;
}
