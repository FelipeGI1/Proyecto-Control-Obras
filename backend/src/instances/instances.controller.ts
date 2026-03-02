import { Controller, Post, Body } from '@nestjs/common';
import { InstancesService } from './instances.service';

@Controller('instances')
export class InstancesController {
  constructor(private readonly instancesService: InstancesService) {}

  @Post('draft')
  saveDraft(@Body() body: any) {
    return this.instancesService.saveDraft(body);
  }
}