import { Routes, Route, Link } from 'react-router-dom';
import ExecutionList from './components/ExecutionList';
import ExecutionDetail from './components/ExecutionDetail';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-gray-900">
                X-Ray Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<ExecutionList />} />
          <Route path="/executions/:id" element={<ExecutionDetail />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

