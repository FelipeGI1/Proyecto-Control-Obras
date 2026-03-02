import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ControlInstance } from './instance.entity';

@Entity('instance_answers')
export class InstanceAnswer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  itemId: string; // El ID de la pregunta (ej: "1", "2")

  @Column({ type: 'text' })
  value: string; // La respuesta (ej: "SI", "NO", "Baños...")

  @ManyToOne(() => ControlInstance, instance => instance.answers, { onDelete: 'CASCADE' })
  instance: ControlInstance;
}