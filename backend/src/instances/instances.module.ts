import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstancesService } from './instances.service';
import { InstancesController } from './instances.controller';
import { ControlInstance } from './entities/instance.entity';
import { InstanceAnswer } from './entities/instance-answer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ControlInstance, InstanceAnswer])],
  controllers: [InstancesController],
  providers: [InstancesService],
})
export class InstancesModule {}