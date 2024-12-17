import { Controller, Post, Query } from '@nestjs/common';
import { FlowService } from './flow.service';

@Controller('flow')
export class FlowController {
  constructor(private readonly flowService: FlowService) {}

  @Post('run')
  runFlow(@Query('stage') stage: string, @Query('step') step?: string) {
    try {
      this.flowService.runStage(stage, step);
      const context = this.flowService.getContext();
      return { message: 'Flujo ejecutado correctamente', context };
    } catch (error) {
      return { error: error.message };
    }
  }
}
