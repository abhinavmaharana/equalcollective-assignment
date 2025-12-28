# X-Ray Library and Dashboard

A general-purpose X-Ray system for debugging multi-step, non-deterministic algorithmic systems. X-Ray provides transparency into decision-making processes by capturing the complete decision trail at each step, including inputs, outputs, reasoning, and per-candidate evaluations.

## 🚀 Quick Start

```bash
# Install dependencies
npm install
npm run build --workspace=@xray/sdk

# Start backend (Terminal 1)
npm run dev:server

# Start dashboard (Terminal 2)
npm run dev:dashboard

# Run demo (Terminal 3)
npm run dev:demo
```

Then open http://localhost:3000 in your browser!

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

- **Node.js 18+** (check with `node --version`)
- **npm** (comes with Node.js, check with `npm --version`)
- A terminal/command line interface
- A modern web browser (Chrome, Firefox, Safari, Edge)

### Step-by-Step Installation

#### Step 1: Navigate to Project Directory

```bash
cd /path/to/equalcollective-assignment
```

Or if you cloned the repository:
```bash
cd equalcollective-assignment
```

#### Step 2: Install Dependencies

Install all dependencies for all packages:

```bash
npm install
```

This will install dependencies for:
- Root workspace
- X-Ray SDK package
- Backend server package
- Dashboard package
- Demo app package

**Expected output:** Should complete without errors. You may see some warnings, which are normal.

#### Step 3: Build the SDK

The SDK must be built first since other packages depend on it:

```bash
npm run build --workspace=@xray/sdk
```

**Expected output:**
```
> @xray/sdk@1.0.0 build
> tsc
```

#### Step 4: Verify Installation

Check that everything is set up correctly:

```bash
npm ls --workspaces --depth=0
```

You should see all four packages listed:
- @xray/sdk
- @xray/server
- @xray/dashboard
- @xray/demo-app

### Running the System

You'll need **three terminal windows/tabs** open simultaneously:

#### Terminal 1: Start the Backend Server

```bash
npm run dev:server
```

**Expected output:**
```
> @xray/server@1.0.0 dev
> tsx watch src/server.ts

Database initialized successfully
X-Ray server running on http://localhost:3001
```

**What this does:**
- Starts Express server on port 3001
- Initializes SQLite database (`packages/xray-server/xray.db`)
- Creates database tables if they don't exist
- Provides REST API endpoints for executions

**Keep this terminal open** - the server must be running for the system to work.

#### Terminal 2: Start the Dashboard

```bash
npm run dev:dashboard
```

**Expected output:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

**What this does:**
- Starts Vite development server
- Serves React dashboard on port 3000
- Automatically opens in browser (or navigate to http://localhost:3000)

**Keep this terminal open** - the dashboard must be running to view executions.

#### Terminal 3: Run the Demo App

```bash
npm run dev:demo
```

**Expected output:**
```
🚀 Starting Competitor Selection Workflow...

Reference Product: ProBrand Steel Bottle 32oz Insulated
Price: $29.99, Rating: 4.2★, Reviews: 1247

✅ Workflow completed successfully!

Selected Competitor:
  Title: HydroFlask 32oz Wide Mouth Water Bottle
  Price: $44.99
  Rating: 4.5★
  Reviews: 8932

📤 Sending execution data to backend...
✅ Execution stored successfully!

📊 View in dashboard: http://localhost:3000/executions/exec-xxxxx-xxxxx
```

**What this does:**
- Runs the competitor selection workflow
- Instruments each step with X-Ray
- Generates execution data
- Sends data to backend API
- Prints dashboard URL

**You can run this multiple times** to create multiple executions for testing.

### Viewing Results

1. **Open your browser** and navigate to `http://localhost:3000`
2. **You should see** the execution list with your demo execution(s)
3. **Click "View Details"** on any execution to see the full decision trail
4. **Explore:**
   - Expand steps to see inputs/outputs/reasoning
   - View evaluations with pass/fail indicators
   - Use search and filter features
   - Export execution data as JSON

### Troubleshooting

#### Port Already in Use

If you see `EADDRINUSE: address already in use :::3001`:

```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Or use a different port
PORT=3002 npm run dev:server
```

#### Dashboard Can't Connect to Server

- Ensure the server is running on port 3001
- Check browser console for errors (F12 → Console)
- Verify `packages/xray-dashboard/vite.config.ts` proxy settings

#### SDK Not Found Error

If demo app can't find `@xray/sdk`:

```bash
# Rebuild the SDK
npm run build --workspace=@xray/sdk

# Or rebuild all packages
npm run build
```

#### Database Errors

- Delete `packages/xray-server/xray.db` and restart the server
- Check file permissions in the server directory
- Ensure you have write permissions

#### Build Errors

If you see TypeScript errors:

```bash
# Clean and rebuild
rm -rf packages/*/dist packages/*/node_modules
npm install
npm run build --workspace=@xray/sdk
```

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

All endpoints are prefixed with `/api`:

- `GET /api/executions` - List all executions (returns array of execution summaries)
- `GET /api/executions/:id` - Get full execution details with all steps and evaluations
- `POST /api/executions` - Store a new execution (accepts XRayExecution JSON)
- `GET /api/executions/:id/steps` - Get steps for an execution (alias for GET /api/executions/:id, returns steps array)
- `GET /health` - Health check endpoint (returns `{ status: 'ok' }`)

**Example API Usage:**

```bash
# List all executions
curl http://localhost:3001/api/executions

# Get specific execution
curl http://localhost:3001/api/executions/exec-1234567890-abc123

# Store new execution
curl -X POST http://localhost:3001/api/executions \
  -H "Content-Type: application/json" \
  -d @execution.json
```

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

- **Execution List**: 
  - Quick overview of all executions with status and duration
  - **Search functionality** - Search by execution ID or metadata
  - **Status filtering** - Filter by All/Completed/Running
  - **Relative time display** - Shows "2 minutes ago" for recent executions
  - **Copy ID** - One-click copy execution ID to clipboard
- **Execution Detail**: 
  - Step-by-step view with expandable sections
  - **Summary metrics panel** - Quick stats (total steps, passed/failed counts)
  - **Export functionality** - Download execution as JSON file
  - **Copy execution ID** button
- **Step View**:
  - Expandable step cards with inputs, outputs, and reasoning
  - **Evaluation filtering** - Filter evaluations by All/Passed/Failed
  - Pass/fail counts displayed in header
- **Visual Indicators**: 
  - Color-coded pass/fail status (green/red) for quick scanning
  - Status badges for execution state
- **Loading States**: 
  - Skeleton loaders for better perceived performance
- **JSON Viewer**: Raw data available for deep inspection
- **Responsive Design**: Works on different screen sizes

### Storage Strategy

- **SQLite**: File-based, no setup required, perfect for demos and small deployments
- **JSON Columns**: Flexible schema that accommodates varying step structures
- **Normalized Tables**: Separate tables for executions, steps, and evaluations for efficient querying

## Completed Features

### ✅ Core Functionality
- [x] X-Ray SDK with clean, simple API
- [x] Execution tracking with step nesting support
- [x] Per-candidate evaluation capture
- [x] Backend API server with SQLite storage
- [x] React dashboard for visualization
- [x] Demo application showcasing the system

### ✅ Dashboard Features
- [x] Execution list with search and status filtering
- [x] Relative time formatting ("2 minutes ago")
- [x] Copy execution ID to clipboard
- [x] Execution detail view with expandable steps
- [x] Summary metrics panel
- [x] Evaluation filtering (All/Passed/Failed)
- [x] Export execution as JSON
- [x] Skeleton loading states
- [x] Color-coded pass/fail indicators

### ✅ Code Quality
- [x] Full TypeScript with type safety
- [x] Refactored long functions into smaller, focused ones
- [x] Shared utility functions (DRY principle)
- [x] Comprehensive error handling and validation
- [x] Clear, readable code structure
- [x] JSDoc comments on key functions

### ✅ Error Handling
- [x] SDK validation (prevents invalid operations)
- [x] API request validation with detailed error messages
- [x] Network error handling in dashboard
- [x] User-friendly error messages throughout

## Known Limitations & Future Improvements

### Current Limitations

1. **Single Execution Context**: SDK supports one active execution at a time
2. **In-Memory During Execution**: Data is only persisted when sent to the backend
3. **No Real-Time Updates**: Dashboard requires manual refresh (no WebSocket streaming)
4. **No Authentication**: API has no authentication/authorization
5. **Limited Querying**: No advanced query interface for finding patterns across executions
6. **No Pagination**: All executions load at once (fine for demo, but would need pagination for production)

### Future Improvements

1. **Multiple Execution Contexts**: Support concurrent executions with context isolation
2. **Streaming API**: Real-time updates to dashboard via WebSockets as executions progress
3. **Advanced Search**: Search by step names, filter by date ranges, complex queries
4. **Import Functionality**: Import exported JSON executions for analysis
5. **Step Templates**: Predefined step types with validation schemas
6. **Performance Metrics**: Visualize step durations, identify bottlenecks, execution timelines
7. **Comparison View**: Compare multiple executions side-by-side
8. **Query Interface**: SQL-like query interface for finding specific patterns
9. **Authentication**: Add user authentication and multi-tenancy
10. **Production Storage**: Support for PostgreSQL, MongoDB, etc.
11. **Pagination**: Paginate execution list for better performance with many executions
12. **Toast Notifications**: Visual feedback for actions like copy, export, etc.

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

## Quick Start Guide

### First Time Setup (5 minutes)

1. **Install dependencies:**
   ```bash
   npm install
   npm run build --workspace=@xray/sdk
   ```

2. **Start backend server** (Terminal 1):
   ```bash
   npm run dev:server
   ```

3. **Start dashboard** (Terminal 2):
   ```bash
   npm run dev:dashboard
   ```

4. **Run demo** (Terminal 3):
   ```bash
   npm run dev:demo
   ```

5. **View results:** Open http://localhost:3000 in your browser

### Running Multiple Executions

To create multiple executions for testing:

1. Keep server and dashboard running
2. Run `npm run dev:demo` multiple times in Terminal 3
3. Each run creates a new execution
4. Refresh the dashboard to see all executions
5. Use search/filter to find specific executions

## Testing

The system is tested manually via the demo app. To test all features:

1. **Basic Flow Test:**
   - Start server and dashboard
   - Run demo app
   - Verify execution appears in dashboard
   - Click "View Details" and verify all steps are visible

2. **Search & Filter Test:**
   - Run demo multiple times to create several executions
   - Use search box to find execution by ID
   - Use status filter to show only completed/running
   - Verify filtered results are correct

3. **Evaluation Test:**
   - Open execution detail view
   - Expand the "apply_filters" step
   - Use evaluation filter dropdown (All/Passed/Failed)
   - Verify evaluations are filtered correctly
   - Expand evaluation cards to see details

4. **Export Test:**
   - Click "Export JSON" button in execution detail
   - Verify JSON file downloads
   - Open file and verify it contains complete execution data

5. **Copy Test:**
   - Click copy icon next to execution ID in list view
   - Click "Copy ID" button in detail view
   - Paste and verify ID was copied correctly

6. **Error Handling Test:**
   - Stop the backend server
   - Try to access dashboard
   - Verify error message is displayed
   - Restart server and verify it recovers

## License

This is a take-home assignment project.

