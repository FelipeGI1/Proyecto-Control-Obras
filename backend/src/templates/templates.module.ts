import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplatesService } from './templates.service';
import { TemplatesController } from './templates.controller';
import { ProtocolTemplate } from './entities/template.entity';
import { TemplateSection } from './entities/template-section.entity';
import { TemplateItem } from './entities/template-item.entity';

@Module({
  // ¡Importante registrar las 3 aquí!
  imports: [TypeOrmModule.forFeature([ProtocolTemplate, TemplateSection, TemplateItem])],
  controllers: [TemplatesController],
  providers: [TemplatesService],
})
export class TemplatesModule {}