export class Flow {
    
  protected stages: Record<string, string[]> = {};
  protected steps: Record<string, (ctx: Record<string, any>) => FlowResult> = {};
  protected context: Record<string, any> = {};

  configure(config: {
    stages: Record<string, string[]>;
    steps: Record<string, (ctx: Record<string, any>) => FlowResult>;
    context: Record<string, any>;
  }) {
    this.stages = config.stages;
    this.steps = config.steps;
    this.context = config.context;
  }

  runStage(stageName: string, stepName?: string) {
    const stage = this.stages[stageName];
    if (!stage) {
      throw new Error(`El subflujo ${stageName} no está definido.`);
    }

    let currentIndex = stepName ? stage.indexOf(stepName) : 0;
    if (currentIndex === -1) {
      throw new Error(`El step ${stepName} no forma parte del stage ${stageName}`);
    }

    while (currentIndex < stage.length) {
      const currentStep = stage[currentIndex];
      const stepFn = this.steps[currentStep];

      if (typeof stepFn !== 'function') {
        throw new Error(`No se encontró método para el step ${currentStep}`);
      }

      const result = stepFn(this.context);

      switch (true) {
        case result === null:
          return;

        case typeof result === 'object':
          return this.runStage(result.stageName, result.stepName);

        default:
          currentIndex++;
          break;
      }
    }
  }
  

  getContext() {
    return this.context;
  }
}

export type FlowResult = 
  | null
  | void
  | { stageName: string; stepName: string };
