import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { TemplateSection } from './template-section.entity';

@Entity('protocol_templates')
export class ProtocolTemplate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  // Una plantilla tiene muchas secciones (Cascade activado para guardar todo de golpe)
  @OneToMany(() => TemplateSection, section => section.template, { cascade: true })
  sections: TemplateSection[];

  @CreateDateColumn()
  createdAt: Date;
}