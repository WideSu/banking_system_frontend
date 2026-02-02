import { Link } from 'react-router-dom';

export default function History() {
  return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold text-gray-900">Transaction History</h2>
      <p className="mt-4 text-gray-500">
        Transaction history API is not available in the current backend version.
      </p>
      <div className="mt-8">
        <Link to="/dashboard" className="text-primary hover:underline">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
