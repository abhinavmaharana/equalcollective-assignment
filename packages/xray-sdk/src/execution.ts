import { XRayExecution, XRayStep, XRayEvaluation, XRayMetadata } from './types';

/**
 * Manages the execution context for X-Ray tracking
 */
export class ExecutionContext {
  private execution: XRayExecution;
  private stepStack: XRayStep[] = [];

  constructor(executionId: string, metadata?: XRayMetadata) {
    this.execution = {
      id: executionId,
      metadata,
      startedAt: new Date().toISOString(),
      steps: [],
    };
  }

  /**
   * Start a new step
   */
  startStep(name: string, input: any, type?: string, metadata?: XRayMetadata): XRayStep {
    const stepId = `${name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const parentStepId = this.stepStack.length > 0 ? this.stepStack[this.stepStack.length - 1].id : undefined;

    const step: XRayStep = {
      id: stepId,
      name,
      type,
      input,
      startedAt: new Date().toISOString(),
      parentStepId,
      metadata,
    };

    this.stepStack.push(step);
    this.execution.steps.push(step);

    return step;
  }

  /**
   * End the current step
   */
  endStep(output?: any, reasoning?: string): XRayStep | null {
    if (this.stepStack.length === 0) {
      return null;
    }

    const step = this.stepStack.pop()!;
    const endedAt = new Date().toISOString();
    const startedAt = new Date(step.startedAt);
    const duration = new Date(endedAt).getTime() - startedAt.getTime();

    step.output = output;
    step.reasoning = reasoning;
    step.endedAt = endedAt;
    step.duration = duration;

    return step;
  }

  /**
   * Add an evaluation to the current step
   */
  addEvaluation(candidate: any, result: any, details?: any): void {
    if (this.stepStack.length === 0) {
      throw new Error('Cannot add evaluation: no active step');
    }

    const step = this.stepStack[this.stepStack.length - 1];
    if (!step.evaluations) {
      step.evaluations = [];
    }

    step.evaluations.push({
      candidate,
      result,
      details,
    });
  }

  /**
   * Get the current execution
   */
  getExecution(): XRayExecution {
    return this.execution;
  }

  /**
   * Finalize the execution
   */
  endExecution(): XRayExecution {
    // End any remaining steps
    while (this.stepStack.length > 0) {
      this.endStep();
    }

    const endedAt = new Date().toISOString();
    const startedAt = new Date(this.execution.startedAt);
    const duration = new Date(endedAt).getTime() - startedAt.getTime();

    this.execution.endedAt = endedAt;
    this.execution.duration = duration;

    return this.execution;
  }

  /**
   * Export execution as JSON
   */
  toJSON(): string {
    return JSON.stringify(this.execution, null, 2);
  }
}

