import { Router, Request, Response } from 'express';
import { storeExecution, getAllExecutions, getExecution } from './db';
import { XRayExecution } from '@xray/sdk';

const router = Router();

/**
 * GET /api/executions
 * List all executions
 */
router.get('/executions', async (req: Request, res: Response) => {
  try {
    const executions = await getAllExecutions();
    res.json(executions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/executions/:id
 * Get a single execution with all steps and evaluations
 */
router.get('/executions/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const execution = await getExecution(id);

    if (!execution) {
      return res.status(404).json({ error: 'Execution not found' });
    }

    res.json(execution);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/executions
 * Store a new execution
 */
router.post('/executions', async (req: Request, res: Response) => {
  try {
    const execution: XRayExecution = req.body;

    // Validate execution structure
    if (!execution) {
      return res.status(400).json({ error: 'Execution data is required' });
    }
    if (!execution.id || typeof execution.id !== 'string') {
      return res.status(400).json({ error: 'Execution must have a valid id (string)' });
    }
    if (!execution.startedAt || typeof execution.startedAt !== 'string') {
      return res.status(400).json({ error: 'Execution must have a valid startedAt (ISO string)' });
    }
    if (!Array.isArray(execution.steps)) {
      return res.status(400).json({ error: 'Execution must have a steps array' });
    }

    // Validate steps
    for (let i = 0; i < execution.steps.length; i++) {
      const step = execution.steps[i];
      if (!step.id || !step.name || !step.startedAt) {
        return res.status(400).json({
          error: `Step ${i + 1} is missing required fields: id, name, or startedAt`,
        });
      }
    }

    await storeExecution(execution);
    res.status(201).json({ id: execution.id, message: 'Execution stored successfully' });
  } catch (error: any) {
    console.error('Error storing execution:', error);
    res.status(500).json({
      error: 'Failed to store execution',
      message: error.message,
    });
  }
});

/**
 * GET /api/executions/:id/steps
 * Get steps for an execution (alias for GET /api/executions/:id)
 */
router.get('/executions/:id/steps', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const execution = await getExecution(id);

    if (!execution) {
      return res.status(404).json({ error: 'Execution not found' });
    }

    res.json(execution.steps);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

