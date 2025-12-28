import { useState } from 'react';
import { XRayEvaluation } from '@xray/sdk';

interface EvaluationCardProps {
  evaluation: XRayEvaluation;
}

function EvaluationCard({ evaluation }: EvaluationCardProps) {
  const [expanded, setExpanded] = useState(false);
  const passed = evaluation.result.passed || evaluation.result.qualified;

  return (
    <div
      className={`border rounded-lg overflow-hidden ${
        passed ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
      }`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 text-left hover:bg-opacity-50 focus:outline-none"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {passed ? (
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <span className={`font-medium ${passed ? 'text-green-800' : 'text-red-800'}`}>
              {passed ? 'PASSED' : 'FAILED'}
            </span>
          </div>
          <svg
            className={`w-4 h-4 text-gray-400 transform transition-transform ${
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
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-200 space-y-3 pt-3">
          {/* Candidate */}
          <div>
            <h5 className="text-xs font-semibold text-gray-700 mb-1">Candidate</h5>
            <div className="bg-white rounded p-2">
              <pre className="text-xs text-gray-800 overflow-x-auto">
                {JSON.stringify(evaluation.candidate, null, 2)}
              </pre>
            </div>
          </div>

          {/* Result */}
          <div>
            <h5 className="text-xs font-semibold text-gray-700 mb-1">Result</h5>
            <div className="bg-white rounded p-2">
              <pre className="text-xs text-gray-800 overflow-x-auto">
                {JSON.stringify(evaluation.result, null, 2)}
              </pre>
            </div>
          </div>

          {/* Details */}
          {evaluation.details && (
            <div>
              <h5 className="text-xs font-semibold text-gray-700 mb-1">Details</h5>
              <div className="bg-white rounded p-2">
                <pre className="text-xs text-gray-800 overflow-x-auto">
                  {JSON.stringify(evaluation.details, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default EvaluationCard;

