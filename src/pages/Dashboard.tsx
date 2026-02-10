import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useBankingStore } from '../store/useBankingStore';
import { getAccount } from '../services/banking';
import AccountCard from '../components/AccountCard';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, ArrowDownLeft, Wallet, CreditCard, Activity } from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend 
} from 'recharts';
import { formatCurrency } from '../lib/utils';

// Mock Data for Charts
const spendingData = [
  { name: 'Housing', value: 1200 },
  { name: 'Food', value: 450 },
  { name: 'Transport', value: 200 },
  { name: 'Utilities', value: 150 },
  { name: 'Entertainment', value: 300 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const incomeExpenseData = [
  { name: 'Jan', Income: 4000, Expense: 2400 },
  { name: 'Feb', Income: 3000, Expense: 1398 },
  { name: 'Mar', Income: 2000, Expense: 9800 },
  { name: 'Apr', Income: 2780, Expense: 3908 },
  { name: 'May', Income: 1890, Expense: 4800 },
  { name: 'Jun', Income: 2390, Expense: 3800 },
];

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
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Dashboard
          </h2>
        </div>
      </div>

      {loading && !user ? (
        <div className="text-center py-10">Loading dashboard...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <>
          {/* Row 1: Overview Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* Total Balance */}
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Wallet className="h-6 w-6 text-gray-400" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">Total Balance</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{formatCurrency(user?.balance || 0)}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link to="/accounts" className="font-medium text-primary hover:text-primary-hover">
                    View all accounts
                  </Link>
                </div>
              </div>
            </div>

            {/* Pending Transfers (Mock) */}
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ArrowRight className="h-6 w-6 text-gray-400" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">Pending Transfers</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">$0.00</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link to="/transfers" className="font-medium text-primary hover:text-primary-hover">
                    View details
                  </Link>
                </div>
              </div>
            </div>

            {/* Recent Activity (Mock) */}
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Activity className="h-6 w-6 text-gray-400" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">Recent Activity</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">No recent activity</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link to="/history" className="font-medium text-primary hover:text-primary-hover">
                    View history
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Charts */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* Spending Breakdown */}
            <div className="rounded-lg bg-white shadow p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Spending Breakdown</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={spendingData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {spendingData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Income vs Expense */}
            <div className="rounded-lg bg-white shadow p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Income vs Expense</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={incomeExpenseData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="Income" fill="#00C49F" />
                    <Bar dataKey="Expense" fill="#FF8042" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Row 3: Quick Actions */}
          <div className="mt-8">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Link to="/transfers?type=transfer" className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:border-gray-400 transition-colors hover:bg-gray-50">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <ArrowRight className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <span className="absolute inset-0" aria-hidden="true" />
                  <p className="text-sm font-medium text-gray-900">Transfer</p>
                  <p className="truncate text-sm text-gray-500">Send money to others</p>
                </div>
              </Link>

              <Link to="/transfers?type=deposit" className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:border-gray-400 transition-colors hover:bg-gray-50">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <ArrowUpRight className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <span className="absolute inset-0" aria-hidden="true" />
                  <p className="text-sm font-medium text-gray-900">Deposit</p>
                  <p className="truncate text-sm text-gray-500">Add funds to account</p>
                </div>
              </Link>

              <Link to="/transfers?type=withdrawal" className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:border-gray-400 transition-colors hover:bg-gray-50">
                <div className="flex-shrink-0">
                   <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                    <ArrowDownLeft className="h-6 w-6 text-red-600" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <span className="absolute inset-0" aria-hidden="true" />
                  <p className="text-sm font-medium text-gray-900">Pay Bills</p>
                  <p className="truncate text-sm text-gray-500">Withdraw / Payments</p>
                </div>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
