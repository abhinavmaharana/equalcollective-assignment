import { XRayExecution } from '@xray/sdk';

const API_BASE = '/api';

export interface ExecutionSummary {
  id: string;
  metadata?: any;
  startedAt: string;
  endedAt?: string;
  duration?: number;
}

async function fetchWithErrorHandling(url: string, errorMessage: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || errorMessage);
    }
    return response.json();
  } catch (error: any) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`${errorMessage}: ${error.message || 'Network error'}`);
  }
}

export async function fetchExecutions(): Promise<ExecutionSummary[]> {
  return fetchWithErrorHandling(
    `${API_BASE}/executions`,
    'Failed to fetch executions. Please check if the server is running.'
  );
}

export async function fetchExecution(id: string): Promise<XRayExecution> {
  return fetchWithErrorHandling(
    `${API_BASE}/executions/${id}`,
    `Failed to fetch execution ${id}`
  );
}

export async function storeExecution(execution: XRayExecution): Promise<void> {
  const response = await fetch(`${API_BASE}/executions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(execution),
  });
  if (!response.ok) {
    throw new Error('Failed to store execution');
  }
}

