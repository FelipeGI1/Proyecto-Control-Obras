import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { ProtocolTemplate } from './template.entity';
import { TemplateItem } from './template-item.entity';

@Entity('template_sections')
export class TemplateSection {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    name: string;

    // Una sección pertenece a una plantilla
    @ManyToOne(() => ProtocolTemplate, template => template.sections, { onDelete: 'CASCADE' })
    template: ProtocolTemplate;

    // Una sección tiene muchos ítems
    @OneToMany(() => TemplateItem, item => item.section, { cascade: true })
    items: TemplateItem[];
}