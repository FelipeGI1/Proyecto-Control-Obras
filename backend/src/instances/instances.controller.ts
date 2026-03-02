import { Controller, Post, Body, Patch, Param, Get } from '@nestjs/common';
import { InstancesService } from './instances.service';

@Controller('instances')
export class InstancesController {
  constructor(private readonly instancesService: InstancesService) {}

  @Post('draft')
  saveDraft(@Body() body: any) {
    return this.instancesService.saveDraft(body);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.instancesService.updateStatus(id, status);
  }

  @Get()
  findAll() {
    return this.instancesService.findAll();
  }
}