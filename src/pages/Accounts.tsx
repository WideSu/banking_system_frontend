import { useAuthStore } from '../store/useAuthStore';
import AccountCard from '../components/AccountCard';
import { Plus } from 'lucide-react';

export default function Accounts() {
  const { user } = useAuthStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Accounts</h1>
        <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Open New Account
        </button>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
         {user && (
            <div className="cursor-pointer transform transition hover:scale-105">
                <AccountCard account={user} />
            </div>
         )}
         
         {/* Mock Secondary Account */}
         <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 cursor-pointer transform transition hover:scale-105 opacity-70">
            <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                    <div className="flex-shrink-0 bg-gray-100 rounded-md p-3">
                        <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                        <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Savings Account</dt>
                            <dd>
                                <div className="text-lg font-medium text-gray-900">$12,450.00</div>
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm text-gray-500">
                    **** **** **** 4567
                </div>
            </div>
         </div>
      </div>
    </div>
  );
}
