import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Tab } from '@headlessui/react';
import DepositForm from '../components/transactions/DepositForm';
import WithdrawalForm from '../components/transactions/WithdrawalForm';
import TransferForm from '../components/transactions/TransferForm';
import { cn } from '../lib/utils';
import { useAuthStore } from '../store/useAuthStore';
import { getAccount } from '../services/banking';

export default function Transactions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();
  
  const typeParam = searchParams.get('type');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const categories = ['Deposit', 'Withdrawal', 'Transfer'];

  useEffect(() => {
    switch (typeParam) {
      case 'deposit':
        setSelectedIndex(0);
        break;
      case 'withdrawal':
        setSelectedIndex(1);
        break;
      case 'transfer':
        setSelectedIndex(2);
        break;
      default:
        setSelectedIndex(0);
        break;
    }
  }, [typeParam]);

  const handleTabChange = (index: number) => {
    setSelectedIndex(index);
    const type = categories[index].toLowerCase();
    setSearchParams({ type });
  };

  const handleSuccess = async () => {
    if (user) {
        try {
            const updatedUser = await getAccount(user.name);
            updateUser(updatedUser);
        } catch (e) {
            console.error("Failed to update user balance", e);
        }
    }
    alert('Transaction successful!');
    navigate('/dashboard');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Make a Transaction</h1>
      
      <Tab.Group selectedIndex={selectedIndex} onChange={handleTabChange}>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
          {categories.map((category) => (
            <Tab
              key={category}
              className={({ selected }) =>
                cn(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white text-primary shadow'
                    : 'text-gray-600 hover:bg-white/[0.12] hover:text-primary'
                )
              }
            >
              {category}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
            <Tab.Panel
                className={cn(
                'rounded-xl bg-white p-3',
                'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
                )}
            >
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Deposit Funds</h2>
                    <DepositForm onSuccess={handleSuccess} />
                </div>
            </Tab.Panel>
            <Tab.Panel
                className={cn(
                'rounded-xl bg-white p-3',
                'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
                )}
            >
                 <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Withdraw Funds</h2>
                    <WithdrawalForm onSuccess={handleSuccess} />
                </div>
            </Tab.Panel>
            <Tab.Panel
                className={cn(
                'rounded-xl bg-white p-3',
                'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
                )}
            >
                 <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Transfer Funds</h2>
                    <TransferForm onSuccess={handleSuccess} />
                </div>
            </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
