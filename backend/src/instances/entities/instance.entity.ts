import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { InstanceAnswer } from './instance-answer.entity';

@Entity('control_instances')
export class ControlInstance {
  @PrimaryGeneratedColumn('uuid') // Usamos UUID para que sea más seguro y difícil de adivinar
  id: string;

  @Column()
  templateId: number; // Saber qué plantilla estamos usando

  @Column()
  proyecto: string;

  @Column()
  ubicacion: string;

  @Column()
  pisoDepto: string;

  @Column({ default: 'BORRADOR' })
  status: string; // Estados posibles: BORRADOR, PENDIENTE_REVISION, APROBADO, RECHAZADO

  // Las respuestas asociadas a esta instancia (Cascade para guardar todo de un golpe)
  @OneToMany(() => InstanceAnswer, answer => answer.instance, { cascade: true })
  answers: InstanceAnswer[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date; // Muy importante para saber cuándo fue la última vez que guardó el borrador
}