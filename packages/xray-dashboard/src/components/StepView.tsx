import { useState } from 'react';
import { XRayStep, XRayEvaluation } from '@xray/sdk';
import EvaluationCard from './EvaluationCard';
import { formatDuration } from '../utils';

interface StepViewProps {
  step: XRayStep;
  index: number;
}

function StepView({ step, index }: StepViewProps) {
  const [expanded, setExpanded] = useState(index === 0); // Expand first step by default
  const [evaluationFilter, setEvaluationFilter] = useState<'all' | 'passed' | 'failed'>('all');


  const hasEvaluations = step.evaluations && step.evaluations.length > 0;
  const passedCount = step.evaluations?.filter((e: XRayEvaluation) => e.result.passed || e.result.qualified).length || 0;
  const failedCount = (step.evaluations?.length || 0) - passedCount;

  // Filter evaluations based on selection
  const filteredEvaluations = hasEvaluations
    ? step.evaluations!.filter((evaluation: XRayEvaluation) => {
        if (evaluationFilter === 'all') return true;
        if (evaluationFilter === 'passed') return evaluation.result.passed || evaluation.result.qualified;
        if (evaluationFilter === 'failed') return !(evaluation.result.passed || evaluation.result.qualified);
        return true;
      })
    : [];

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-6 py-4 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{step.name}</h3>
              {step.type && (
                <p className="text-sm text-gray-500">{step.type}</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {hasEvaluations && (
              <div className="text-sm text-gray-600">
                <span className="text-green-600 font-medium">{passedCount} passed</span>
                {failedCount > 0 && (
                  <>
                    {' / '}
                    <span className="text-red-600 font-medium">{failedCount} failed</span>
                  </>
                )}
              </div>
            )}
            <div className="text-sm text-gray-500">
              {formatDuration(step.duration)}
            </div>
            <svg
              className={`w-5 h-5 text-gray-400 transform transition-transform ${
                expanded ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </button>

      {expanded && (
        <div className="px-6 py-4 border-t border-gray-200 space-y-4">
          {/* Input */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Input</h4>
            <div className="bg-gray-50 rounded p-3">
              <pre className="text-xs text-gray-800 overflow-x-auto">
                {JSON.stringify(step.input, null, 2)}
              </pre>
            </div>
          </div>

          {/* Output */}
          {step.output && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Output</h4>
              <div className="bg-gray-50 rounded p-3">
                <pre className="text-xs text-gray-800 overflow-x-auto">
                  {JSON.stringify(step.output, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Reasoning */}
          {step.reasoning && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Reasoning</h4>
              <p className="text-sm text-gray-800 bg-blue-50 rounded p-3">{step.reasoning}</p>
            </div>
          )}

          {/* Evaluations */}
          {hasEvaluations && (
            <div>
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-semibold text-gray-700">
                  Evaluations ({step.evaluations!.length})
                </h4>
                <select
                  value={evaluationFilter}
                  onChange={(e) => setEvaluationFilter(e.target.value as 'all' | 'passed' | 'failed')}
                  className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All ({step.evaluations!.length})</option>
                  <option value="passed">Passed ({passedCount})</option>
                  <option value="failed">Failed ({failedCount})</option>
                </select>
              </div>
              {filteredEvaluations.length === 0 ? (
                <div className="text-sm text-gray-500 text-center py-4">
                  No evaluations match the selected filter.
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredEvaluations.map((evaluation: XRayEvaluation, idx: number) => (
                    <EvaluationCard key={idx} evaluation={evaluation} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default StepView;

