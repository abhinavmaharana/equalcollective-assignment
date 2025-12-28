import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchExecution } from '../api';
import { XRayExecution } from '@xray/sdk';
import StepView from './StepView';
import { formatDuration, formatDate, copyToClipboard, exportAsJSON } from '../utils';

function ExecutionDetail() {
  const { id } = useParams<{ id: string }>();
  const [execution, setExecution] = useState<XRayExecution | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadExecution();
    }
  }, [id]);

  const loadExecution = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await fetchExecution(id);
      setExecution(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const exportExecution = () => {
    if (!execution) return;
    exportAsJSON(execution, `execution-${execution.id}`);
  };

  const copyExecutionId = async () => {
    if (!execution) return;
    await copyToClipboard(execution.id);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="mb-6">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse mb-4"></div>
          <div className="h-10 bg-gray-200 rounded w-64 animate-pulse"></div>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error: {error}</p>
        <Link to="/" className="mt-2 inline-block text-blue-600 hover:text-blue-800">
          ← Back to list
        </Link>
      </div>
    );
  }

  if (!execution) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">Execution not found</p>
        <Link to="/" className="mt-2 inline-block text-blue-600 hover:text-blue-800">
          ← Back to list
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-800 mb-2 inline-block"
            >
              ← Back to executions
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Execution Details</h1>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={copyExecutionId}
              className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              title="Copy execution ID"
            >
              Copy ID
            </button>
            <button
              onClick={exportExecution}
              className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Export JSON
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Execution ID</label>
            <p className="mt-1 text-sm font-mono text-gray-900">{execution.id}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Status</label>
            <p className="mt-1">
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  execution.endedAt
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {execution.endedAt ? 'Completed' : 'Running'}
              </span>
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Started At</label>
            <p className="mt-1 text-sm text-gray-900">{formatDate(execution.startedAt)}</p>
          </div>
          {execution.endedAt && (
            <div>
              <label className="text-sm font-medium text-gray-500">Ended At</label>
              <p className="mt-1 text-sm text-gray-900">{formatDate(execution.endedAt)}</p>
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-gray-500">Duration</label>
            <p className="mt-1 text-sm text-gray-900">{formatDuration(execution.duration)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Steps</label>
            <p className="mt-1 text-sm text-gray-900">{execution.steps.length}</p>
          </div>
        </div>
      </div>

      {/* Summary Metrics */}
      {execution.steps.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-2xl font-bold text-gray-900">{execution.steps.length}</div>
              <div className="text-sm text-gray-600">Total Steps</div>
            </div>
            {execution.steps.some(s => s.evaluations && s.evaluations.length > 0) && (
              <>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {execution.steps.reduce((sum, s) => {
                      return sum + (s.evaluations?.filter(e => e.result.passed || e.result.qualified).length || 0);
                    }, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Passed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    {execution.steps.reduce((sum, s) => {
                      return sum + (s.evaluations?.filter(e => !(e.result.passed || e.result.qualified)).length || 0);
                    }, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Failed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {execution.steps.reduce((sum, s) => sum + (s.evaluations?.length || 0), 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Evaluations</div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Steps</h2>
        {execution.steps.map((step, index) => (
          <StepView key={step.id} step={step} index={index} />
        ))}
      </div>
    </div>
  );
}

export default ExecutionDetail;

