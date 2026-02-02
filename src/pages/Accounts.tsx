import { Link } from 'react-router-dom';

export default function Accounts() {
  return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold text-gray-900">Accounts</h2>
      <p className="mt-4 text-gray-500">
        Multiple account management is not supported by the current backend system.
        <br />
        You can view your current account details on the Dashboard.
      </p>
      <div className="mt-8">
        <Link to="/dashboard" className="text-primary hover:underline">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
