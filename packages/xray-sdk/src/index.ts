import { ExecutionContext } from './execution';
import { XRayExecution, XRayMetadata } from './types';

/**
 * Main X-Ray SDK API
 */
class XRay {
  private currentContext: ExecutionContext | null = null;

  /**
   * Start a new execution
   */
  startExecution(metadata?: XRayMetadata): ExecutionContext {
    if (this.currentContext) {
      throw new Error(
        'An execution is already in progress. Call endExecution() before starting a new one.'
      );
    }
    const executionId = `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.currentContext = new ExecutionContext(executionId, metadata);
    return this.currentContext;
  }

  /**
   * Start a new step
   */
  startStep(name: string, input: any, type?: string, metadata?: XRayMetadata): void {
    if (!this.currentContext) {
      throw new Error('No active execution. Call startExecution() first.');
    }
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      throw new Error('Step name must be a non-empty string.');
    }
    this.currentContext.startStep(name, input, type, metadata);
  }

  /**
   * End the current step
   */
  endStep(output?: any, reasoning?: string): void {
    if (!this.currentContext) {
      throw new Error('No active execution. Call startExecution() first.');
    }
    this.currentContext.endStep(output, reasoning);
  }

  /**
   * Add an evaluation to the current step
   */
  addEvaluation(candidate: any, result: any, details?: any): void {
    if (!this.currentContext) {
      throw new Error('No active execution. Call startExecution() first.');
    }
    if (candidate === null || candidate === undefined) {
      throw new Error('Evaluation candidate cannot be null or undefined.');
    }
    if (result === null || result === undefined) {
      throw new Error('Evaluation result cannot be null or undefined.');
    }
    this.currentContext.addEvaluation(candidate, result, details);
  }

  /**
   * End the current execution and return the execution data
   */
  endExecution(): XRayExecution {
    if (!this.currentContext) {
      throw new Error('No active execution. Call startExecution() first.');
    }

    const execution = this.currentContext.endExecution();
    this.currentContext = null;
    return execution;
  }

  /**
   * Get the current execution context (for advanced usage)
   */
  getContext(): ExecutionContext | null {
    return this.currentContext;
  }

  /**
   * Get the current execution without ending it
   */
  getExecution(): XRayExecution | null {
    return this.currentContext ? this.currentContext.getExecution() : null;
  }
}

// Export singleton instance
export const xray = new XRay();

// Export types
export * from './types';
export { ExecutionContext } from './execution';

// Default export
export default xray;

