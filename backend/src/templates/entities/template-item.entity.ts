// backend/src/templates/entities/template-item.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { TemplateSection } from './template-section.entity';

@Entity('template_items')
export class TemplateItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    name: string;

    // NUEVO: Guardaremos si es de tipo CHECK o TEXT
    @Column({ type: 'varchar', length: 20, default: 'CHECK' })
    itemType: string;

    @ManyToOne(() => TemplateSection, section => section.items, { onDelete: 'CASCADE' })
    section: TemplateSection;
}