import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ControlInstance } from './entities/instance.entity';
import { InstanceAnswer } from './entities/instance-answer.entity';

@Injectable()
export class InstancesService {
  constructor(
    @InjectRepository(ControlInstance)
    private instanceRepo: Repository<ControlInstance>,
    @InjectRepository(InstanceAnswer)
    private answerRepo: Repository<InstanceAnswer>,
  ) {}

  async saveDraft(data: any) {
    const { instanceId, templateId, locationData, answers } = data;

    const answersArray = Object.keys(answers).map(key => ({
      itemId: key,
      value: answers[key]
    }));

    if (instanceId) {
      const instance = await this.instanceRepo.findOneBy({ id: instanceId });
      if (!instance) throw new NotFoundException('Instancia no encontrada');

      await this.answerRepo.delete({ instance: { id: instanceId } });

      instance.answers = answersArray as InstanceAnswer[];
      return await this.instanceRepo.save(instance);
    } else {
      const newInstance = this.instanceRepo.create({
        templateId: Number(templateId),
        proyecto: locationData.proyecto,
        ubicacion: locationData.ubicacion,
        pisoDepto: locationData.pisoDepto,
        status: 'BORRADOR',
        answers: answersArray,
      });
      return await this.instanceRepo.save(newInstance);
    }
  }
}