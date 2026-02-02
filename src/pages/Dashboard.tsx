import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useBankingStore } from '../store/useBankingStore';
import { getAccount } from '../services/banking';
import AccountCard from '../components/AccountCard';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const { user, updateUser } = useAuthStore();
  const { setLoading, loading, setError, error } = useBankingStore();

  useEffect(() => {
    const fetchAccount = async () => {
      if (!user) return;
      setLoading(true);
      try {
        // Refresh user data
        const data = await getAccount(user.name);
        updateUser(data);
      } catch (err: any) {
        console.error(err);
        setError('Failed to refresh account data');
      } finally {
        setLoading(false);
      }
    };

    fetchAccount();
  }, [user?.name, setLoading, setError, updateUser]);

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Dashboard
          </h2>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <Link
            to="/transactions"
            className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            New Transaction
          </Link>
        </div>
      </div>

      {loading && !user ? (
        <div className="text-center py-10">Loading account...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <>
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Your Account</h3>
          {user && (
             <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
               <AccountCard account={user} />
             </div>
          )}

          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-lg font-medium leading-6 text-gray-900">Quick Actions</h3>
            </div>
             <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Link to="/transactions?type=deposit" className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:border-gray-400">
                    <div className="min-w-0 flex-1">
                        <span className="absolute inset-0" aria-hidden="true" />
                        <p className="text-sm font-medium text-gray-900">Deposit</p>
                        <p className="truncate text-sm text-gray-500">Add funds to your account</p>
                    </div>
                    <div className="flex-shrink-0">
                        <ArrowRight className="h-5 w-5 text-gray-400" />
                    </div>
                </Link>
                <Link to="/transactions?type=withdrawal" className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:border-gray-400">
                    <div className="min-w-0 flex-1">
                        <span className="absolute inset-0" aria-hidden="true" />
                        <p className="text-sm font-medium text-gray-900">Withdraw</p>
                        <p className="truncate text-sm text-gray-500">Withdraw funds</p>
                    </div>
                    <div className="flex-shrink-0">
                         <ArrowRight className="h-5 w-5 text-gray-400" />
                    </div>
                </Link>
                 <Link to="/transactions?type=transfer" className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:border-gray-400">
                    <div className="min-w-0 flex-1">
                        <span className="absolute inset-0" aria-hidden="true" />
                        <p className="text-sm font-medium text-gray-900">Transfer</p>
                        <p className="truncate text-sm text-gray-500">Transfer between accounts</p>
                    </div>
                    <div className="flex-shrink-0">
                         <ArrowRight className="h-5 w-5 text-gray-400" />
                    </div>
                </Link>
             </div>
          </div>
        </>
      )}
    </div>
  );
}
