import { useState } from 'react';
import { Download, Filter, Search } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { cn } from '../lib/utils';

// Mock Data
const mockTransactions = [
  { id: 1, date: '2023-10-25', description: 'Grocery Store', amount: -150.00, type: 'Withdrawal', status: 'Completed' },
  { id: 2, date: '2023-10-24', description: 'Salary Deposit', amount: 3000.00, type: 'Deposit', status: 'Completed' },
  { id: 3, date: '2023-10-22', description: 'Transfer to Alice', amount: -500.00, type: 'Transfer', status: 'Completed' },
  { id: 4, date: '2023-10-20', description: 'Utility Bill', amount: -120.50, type: 'Withdrawal', status: 'Pending' },
  { id: 5, date: '2023-10-18', description: 'ATM Withdrawal', amount: -200.00, type: 'Withdrawal', status: 'Completed' },
  { id: 6, date: '2023-10-15', description: 'Transfer from Bob', amount: 150.00, type: 'Transfer', status: 'Completed' },
  { id: 7, date: '2023-10-12', description: 'Netflix Subscription', amount: -15.99, type: 'Withdrawal', status: 'Completed' },
  { id: 8, date: '2023-10-10', description: 'Freelance Payment', amount: 850.00, type: 'Deposit', status: 'Completed' },
];

export default function History() {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [filterType, setFilterType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const handleFilter = () => {
    let filtered = mockTransactions;
    
    if (filterType !== 'All') {
      filtered = filtered.filter(t => t.type === filterType);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setTransactions(filtered);
  };

  const clearFilters = () => {
    setFilterType('All');
    setSearchTerm('');
    setTransactions(mockTransactions);
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    alert(`Exporting transaction history as ${format.toUpperCase()}...`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all your transactions including date, description, amount, and status.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none flex space-x-3">
          <button
            onClick={() => handleExport('csv')}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:w-auto"
          >
            <Download className="mr-2 h-4 w-4 text-gray-500" />
            Export CSV
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:w-auto"
          >
            <Download className="mr-2 h-4 w-4 text-gray-500" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-8 bg-white p-4 rounded-lg shadow border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700">Search</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        name="search"
                        id="search"
                        className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                        placeholder="Search transactions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <div className="w-full md:w-64">
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
                <select
                    id="type"
                    name="type"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                >
                    <option value="All">All Types</option>
                    <option value="Deposit">Deposit</option>
                    <option value="Withdrawal">Withdrawal</option>
                    <option value="Transfer">Transfer</option>
                </select>
            </div>
            <div className="flex space-x-2">
                <button
                    onClick={handleFilter}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-hover focus:outline-none"
                >
                    <Filter className="mr-2 h-4 w-4" />
                    Apply
                </button>
                <button
                    onClick={clearFilters}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                    Clear
                </button>
            </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Date
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Description
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Type
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Amount
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">
                        {transaction.date}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
                        {transaction.description}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {transaction.type}
                      </td>
                      <td className={cn(
                        "whitespace-nowrap px-3 py-4 text-sm font-medium",
                        transaction.amount > 0 ? "text-green-600" : "text-gray-900"
                      )}>
                        {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className={cn(
                            "inline-flex rounded-full px-2 text-xs font-semibold leading-5",
                            transaction.status === 'Completed' ? "bg-green-100 text-green-800" : 
                            transaction.status === 'Pending' ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"
                        )}>
                            {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {transactions.length === 0 && (
                  <div className="text-center py-10 text-gray-500">
                      No transactions found matching your filters.
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
