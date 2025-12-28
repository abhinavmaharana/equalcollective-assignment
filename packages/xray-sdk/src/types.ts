/**
 * Core type definitions for X-Ray SDK
 */

export interface XRayMetadata {
  [key: string]: any;
}

export interface XRayEvaluation {
  candidate: any;
  result: {
    passed: boolean;
    qualified?: boolean;
    [key: string]: any;
  };
  details?: {
    [key: string]: any;
  };
}

export interface XRayStep {
  id: string;
  name: string;
  type?: string;
  input: any;
  output?: any;
  reasoning?: string;
  evaluations?: XRayEvaluation[];
  startedAt: string;
  endedAt?: string;
  duration?: number;
  parentStepId?: string;
  metadata?: XRayMetadata;
}

export interface XRayExecution {
  id: string;
  metadata?: XRayMetadata;
  startedAt: string;
  endedAt?: string;
  duration?: number;
  steps: XRayStep[];
}

export interface XRayStepContext {
  step: XRayStep;
  execution: XRayExecution;
}

