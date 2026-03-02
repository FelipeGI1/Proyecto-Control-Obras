import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProtocolTemplate } from './entities/template.entity';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectRepository(ProtocolTemplate)
    private templatesRepository: Repository<ProtocolTemplate>,
  ) {}

  async create(createTemplateDto: any) {
    const newTemplate = this.templatesRepository.create(createTemplateDto);
    return await this.templatesRepository.save(newTemplate);
  }

  async findAll() {
    return await this.templatesRepository.find({
      relations: ['sections', 'sections.items'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  // También optimizamos la búsqueda individual
  async findOne(id: number) {
    const template = await this.templatesRepository.findOne({
      where: { id },
      relations: ['sections', 'sections.items'],
    });

    if (!template) {
      throw new NotFoundException(`La plantilla #${id} no existe`);
    }
    return template;
  }
}