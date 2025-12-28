# X-Ray Library and Dashboard

A general-purpose X-Ray system for debugging multi-step, non-deterministic algorithmic systems. X-Ray provides transparency into decision-making processes by capturing the complete decision trail at each step, including inputs, outputs, reasoning, and per-candidate evaluations.

## Overview

X-Ray answers the question: **"Why did the system make this decision?"** Unlike traditional tracing tools that focus on performance and flow, X-Ray focuses on decision reasoning, making it easy to debug complex multi-step workflows.

### Key Features

- **Lightweight SDK**: Simple API for instrumenting code with minimal overhead
- **General-Purpose**: Works with any multi-step decision process
- **Rich Context**: Captures inputs, outputs, reasoning, and per-item evaluations
- **Visual Dashboard**: Interactive UI for exploring execution trails
- **Persistent Storage**: SQLite database for storing and querying executions

## Architecture

The system consists of four main packages:

1. **`@xray/sdk`** - Core library for instrumenting code
2. **`@xray/server`** - Backend API server with SQLite storage
3. **`@xray/dashboard`** - React dashboard for visualizing executions
4. **`@xray/demo-app`** - Demo competitor selection workflow

## Project Structure

```
equalcollective-assignment/
├── packages/
│   ├── xray-sdk/          # Core X-Ray library
│   ├── xray-server/       # Backend API server
│   ├── xray-dashboard/    # React dashboard UI
│   └── demo-app/          # Demo competitor selection app
├── package.json           # Root workspace config
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- TypeScript knowledge (for development)

### Installation

1. **Clone the repository** (if applicable) or navigate to the project directory

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build all packages**:
   ```bash
   npm run build
   ```

### Running the System

#### 1. Start the Backend Server

In one terminal:
```bash
npm run dev:server
```

The server will start on `http://localhost:3001` and create a SQLite database (`xray.db`) in the server package directory.

#### 2. Start the Dashboard

In another terminal:
```bash
npm run dev:dashboard
```

The dashboard will be available at `http://localhost:3000`.

#### 3. Run the Demo App

In a third terminal:
```bash
npm run dev:demo
```

This will run the competitor selection workflow and automatically send the execution data to the backend. You can then view it in the dashboard.

## Usage

### Basic SDK Usage

```typescript
import xray from '@xray/sdk';

// Start an execution
xray.startExecution({ workflow: 'my_workflow' });

// Start a step
xray.startStep('filter_candidates', { candidates: [...] });

// Add evaluations (for filter/ranking steps)
xray.addEvaluation(
  { id: 'candidate1', price: 29.99 },
  { passed: true, qualified: true },
  { filter_results: { price: 'passed' } }
);

// End the step
xray.endStep({ filtered_count: 10 }, 'Applied price filter');

// End the execution
const execution = xray.endExecution();
```

### API Endpoints

- `GET /api/executions` - List all executions
- `GET /api/executions/:id` - Get full execution details
- `POST /api/executions` - Store a new execution
- `GET /api/executions/:id/steps` - Get steps for an execution

## Demo Application

The demo app showcases a **Competitor Product Selection** workflow:

1. **Keyword Generation**: Simulates an LLM generating search keywords from a product
2. **Candidate Search**: Mock API returning candidate products
3. **Filter & Rank**: Applies filters (price range, rating, reviews) and selects the best match

The demo uses mock data and demonstrates how X-Ray captures:
- Step inputs and outputs
- Reasoning for each decision
- Per-candidate filter evaluations with pass/fail details
- Final selection rationale

## Approach & Design Decisions

### System Design

1. **Monorepo Structure**: All packages in a single workspace for easy development and dependency management
2. **Type Safety**: Full TypeScript throughout for better developer experience and type safety
3. **Separation of Concerns**: SDK is independent and can be used without the dashboard
4. **Flexible Data Model**: JSON columns in SQLite allow varying step data structures
5. **Minimal Dependencies**: Lightweight SDK with no external dependencies

### SDK API Design

The SDK uses a simple, imperative API that's easy to integrate:
- Single global instance (`xray`) for convenience
- Context-aware (tracks current execution and step)
- Supports nested steps via step stack
- Evaluations can be added to any step

### Dashboard UX

- **Execution List**: Quick overview of all executions with status and duration
- **Execution Detail**: Step-by-step view with expandable sections
- **Visual Indicators**: Color-coded pass/fail status for quick scanning
- **JSON Viewer**: Raw data available for deep inspection
- **Responsive Design**: Works on different screen sizes

### Storage Strategy

- **SQLite**: File-based, no setup required, perfect for demos and small deployments
- **JSON Columns**: Flexible schema that accommodates varying step structures
- **Normalized Tables**: Separate tables for executions, steps, and evaluations for efficient querying

## Known Limitations & Future Improvements

### Current Limitations

1. **Single Execution Context**: SDK supports one active execution at a time
2. **In-Memory During Execution**: Data is only persisted when sent to the backend
3. **No Real-Time Updates**: Dashboard requires manual refresh
4. **Basic Search/Filter**: Dashboard list view doesn't support search or filtering yet
5. **No Authentication**: API has no authentication/authorization
6. **Limited Error Handling**: Basic error handling in place

### Future Improvements

1. **Multiple Execution Contexts**: Support concurrent executions with context isolation
2. **Streaming API**: Real-time updates to dashboard as executions progress
3. **Advanced Filtering**: Search and filter executions by metadata, step names, etc.
4. **Export/Import**: Export executions as JSON, import for analysis
5. **Step Templates**: Predefined step types with validation
6. **Performance Metrics**: Track step durations and identify bottlenecks
7. **Comparison View**: Compare multiple executions side-by-side
8. **Query Interface**: SQL-like query interface for finding specific patterns
9. **Authentication**: Add user authentication and multi-tenancy
10. **Production Storage**: Support for PostgreSQL, MongoDB, etc.

## Development

### Building Individual Packages

```bash
# Build SDK
cd packages/xray-sdk && npm run build

# Build server
cd packages/xray-server && npm run build

# Build dashboard
cd packages/xray-dashboard && npm run build

# Build demo app
cd packages/demo-app && npm run build
```

### TypeScript Configuration

Each package has its own `tsconfig.json` that extends the root config. The root config provides common compiler options.

## Testing

Currently, the system is tested manually via the demo app. To test:

1. Start the server and dashboard
2. Run the demo app multiple times
3. Verify executions appear in the dashboard
4. Check that all step details are displayed correctly
5. Verify evaluations show pass/fail status correctly

## License

This is a take-home assignment project.

