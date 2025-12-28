import initSqlJs, { Database } from 'sql.js';
import * as fs from 'fs-extra';
import * as path from 'path';
import { XRayExecution, XRayStep } from '@xray/sdk';

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../xray.db');

let db: Database | null = null;
let sqlJs: any = null;

/**
 * Initialize SQL.js and load/create the database
 */
async function initSqlJsInstance() {
  if (!sqlJs) {
    sqlJs = await initSqlJs();
  }
  return sqlJs;
}

/**
 * Escape SQL string to prevent injection (for demo purposes)
 */
function escapeSqlString(str: string): string {
  return str.replace(/'/g, "''");
}

/**
 * Initialize the database and create tables if they don't exist
 */
export async function initDatabase(): Promise<Database> {
  if (db) {
    return db;
  }

  const SQL = await initSqlJsInstance();

  // Try to load existing database, or create new one
  let buffer: Uint8Array | undefined;
  try {
    if (await fs.pathExists(DB_PATH)) {
      const fileBuffer = await fs.readFile(DB_PATH);
      buffer = new Uint8Array(fileBuffer);
    }
  } catch (error) {
    // File doesn't exist, will create new database
  }

  const database = new SQL.Database(buffer);
  db = database;

  // Enable foreign keys
  database.run('PRAGMA foreign_keys = ON');

  // Create executions table
  database.run(`
    CREATE TABLE IF NOT EXISTS executions (
      id TEXT PRIMARY KEY,
      metadata TEXT,
      started_at TEXT NOT NULL,
      ended_at TEXT,
      duration INTEGER
    )
  `);

  // Create steps table
  database.run(`
    CREATE TABLE IF NOT EXISTS steps (
      id TEXT PRIMARY KEY,
      execution_id TEXT NOT NULL,
      name TEXT NOT NULL,
      type TEXT,
      input TEXT NOT NULL,
      output TEXT,
      reasoning TEXT,
      started_at TEXT NOT NULL,
      ended_at TEXT,
      duration INTEGER,
      parent_step_id TEXT,
      metadata TEXT,
      FOREIGN KEY (execution_id) REFERENCES executions(id) ON DELETE CASCADE,
      FOREIGN KEY (parent_step_id) REFERENCES steps(id) ON DELETE CASCADE
    )
  `);

  // Create evaluations table
  database.run(`
    CREATE TABLE IF NOT EXISTS evaluations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      step_id TEXT NOT NULL,
      candidate TEXT NOT NULL,
      result TEXT NOT NULL,
      details TEXT,
      FOREIGN KEY (step_id) REFERENCES steps(id) ON DELETE CASCADE
    )
  `);

  // Save the database to disk
  await saveDatabase();

  return database;
}

/**
 * Save the database to disk
 */
async function saveDatabase(): Promise<void> {
  if (!db) return;

  const data = db.export();
  const buffer = Buffer.from(data);
  await fs.ensureDir(path.dirname(DB_PATH));
  await fs.writeFile(DB_PATH, buffer);
}

/**
 * Store an execution in the database
 */
export async function storeExecution(execution: XRayExecution): Promise<void> {
  const database = await initDatabase();

  database.run('BEGIN TRANSACTION');

  try {
    // Insert execution
    const execMetadata = JSON.stringify(execution.metadata || {});
    database.run(
      `INSERT INTO executions (id, metadata, started_at, ended_at, duration)
       VALUES (?, ?, ?, ?, ?)`,
      [
        execution.id,
        execMetadata,
        execution.startedAt,
        execution.endedAt || null,
        execution.duration || null,
      ]
    );

    // Insert steps
    for (const step of execution.steps) {
      const stepInput = JSON.stringify(step.input);
      const stepOutput = step.output ? JSON.stringify(step.output) : null;
      const stepMetadata = step.metadata ? JSON.stringify(step.metadata) : null;

      database.run(
        `INSERT INTO steps (
          id, execution_id, name, type, input, output, reasoning,
          started_at, ended_at, duration, parent_step_id, metadata
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          step.id,
          execution.id,
          step.name,
          step.type || null,
          stepInput,
          stepOutput,
          step.reasoning || null,
          step.startedAt,
          step.endedAt || null,
          step.duration || null,
          step.parentStepId || null,
          stepMetadata,
        ]
      );

      // Insert evaluations if any
      if (step.evaluations) {
        for (const evaluation of step.evaluations) {
          const evalCandidate = JSON.stringify(evaluation.candidate);
          const evalResult = JSON.stringify(evaluation.result);
          const evalDetails = evaluation.details ? JSON.stringify(evaluation.details) : null;

          database.run(
            `INSERT INTO evaluations (step_id, candidate, result, details)
             VALUES (?, ?, ?, ?)`,
            [step.id, evalCandidate, evalResult, evalDetails]
          );
        }
      }
    }

    database.run('COMMIT');
    await saveDatabase();
  } catch (error) {
    database.run('ROLLBACK');
    throw error;
  }
}

/**
 * Get all executions
 */
export async function getAllExecutions(): Promise<any[]> {
  const database = await initDatabase();
  const result = database.exec(`
    SELECT id, metadata, started_at, ended_at, duration
    FROM executions
    ORDER BY started_at DESC
  `);

  if (!result.length || !result[0].values) {
    return [];
  }

  return result[0].values.map((row: any[]) => ({
    id: row[0],
    metadata: row[1] ? JSON.parse(row[1] as string) : {},
    startedAt: row[2],
    endedAt: row[3],
    duration: row[4],
  }));
}

/**
 * Get a single execution with all steps and evaluations
 */
export async function getExecution(id: string): Promise<XRayExecution | null> {
  const database = await initDatabase();

  // Escape the ID to prevent SQL injection (for demo)
  const escapedId = escapeSqlString(id);

  // Get execution
  const execResult = database.exec(
    `SELECT id, metadata, started_at, ended_at, duration
     FROM executions
     WHERE id = '${escapedId}'`
  );

  if (!execResult.length || !execResult[0].values || execResult[0].values.length === 0) {
    return null;
  }

  const execRow = execResult[0].values[0];
  const executionRow = {
    id: execRow[0],
    metadata: execRow[1],
    started_at: execRow[2],
    ended_at: execRow[3],
    duration: execRow[4],
  };

  // Get all steps
  const stepsResult = database.exec(
    `SELECT 
      id, name, type, input, output, reasoning,
      started_at, ended_at, duration, parent_step_id, metadata
    FROM steps
    WHERE execution_id = '${escapedId}'
    ORDER BY started_at ASC`
  );

  const stepRows: any[] = [];
  if (stepsResult.length && stepsResult[0].values) {
    const columns = stepsResult[0].columns;
    for (const row of stepsResult[0].values) {
      const stepRow: any = {};
      columns.forEach((col: string, idx: number) => {
        stepRow[col] = row[idx];
      });
      stepRows.push(stepRow);
    }
  }

  // Get all evaluations
  const evalsResult = database.exec(
    `SELECT step_id, candidate, result, details
     FROM evaluations
     WHERE step_id IN (SELECT id FROM steps WHERE execution_id = '${escapedId}')`
  );

  // Build evaluation map
  const evaluationMap = new Map<string, any[]>();
  if (evalsResult.length && evalsResult[0].values) {
    const columns = evalsResult[0].columns;
    for (const row of evalsResult[0].values) {
      const evalRow: any = {};
      columns.forEach((col: string, idx: number) => {
        evalRow[col] = row[idx];
      });

      if (!evaluationMap.has(evalRow.step_id)) {
        evaluationMap.set(evalRow.step_id, []);
      }
      evaluationMap.get(evalRow.step_id)!.push({
        candidate: JSON.parse(evalRow.candidate),
        result: JSON.parse(evalRow.result),
        details: evalRow.details ? JSON.parse(evalRow.details) : undefined,
      });
    }
  }

  // Build steps
  const steps: XRayStep[] = stepRows.map((stepRow) => ({
    id: stepRow.id,
    name: stepRow.name,
    type: stepRow.type || undefined,
    input: JSON.parse(stepRow.input),
    output: stepRow.output ? JSON.parse(stepRow.output) : undefined,
    reasoning: stepRow.reasoning || undefined,
    startedAt: stepRow.started_at,
    endedAt: stepRow.ended_at || undefined,
    duration: stepRow.duration || undefined,
    parentStepId: stepRow.parent_step_id || undefined,
    metadata: stepRow.metadata ? JSON.parse(stepRow.metadata) : undefined,
    evaluations: evaluationMap.get(stepRow.id) || undefined,
  }));

  return {
    id: executionRow.id as string,
    metadata: executionRow.metadata ? JSON.parse(executionRow.metadata as string) : {},
    startedAt: executionRow.started_at as string,
    endedAt: executionRow.ended_at || undefined,
    duration: executionRow.duration || undefined,
    steps,
  };
}

/**
 * Close the database connection
 */
export async function closeDatabase(): Promise<void> {
  if (db) {
    await saveDatabase();
    db.close();
    db = null;
  }
}
