import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'text', nullable: false})
    fullName: string;

    @Column({ type: 'text', unique: true, nullable: false})
    email: string;

    @Column({ type: 'text', nullable: false})
    password: string;

    @Column({ type: 'text', default: 'visualizador'})
    role: string;

    @Column({ default: true})
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
