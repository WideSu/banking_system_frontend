import { useState, useEffect, Fragment } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Dialog, Transition, Tab } from '@headlessui/react';
import { CheckCircle, Clock, User, ArrowRight, X } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { getAccount, transfer, deposit, withdraw } from '../services/banking';
import { cn } from '../lib/utils';
import { formatCurrency } from '../lib/utils';

// Mock Recent Recipients
const recentRecipients = [
  { name: 'Alice Smith', account: 'alice@example.com', avatar: 'AS' },
  { name: 'Bob Jones', account: 'bob@example.com', avatar: 'BJ' },
  { name: 'Charlie Day', account: 'charlie@example.com', avatar: 'CD' },
];

type TransactionType = 'transfer' | 'deposit' | 'withdrawal';

export default function Transfers() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [confirmData, setConfirmData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  const typeParam = searchParams.get('type') as TransactionType || 'transfer';
  const categories = ['Transfer', 'Deposit', 'Withdrawal'];
  const selectedIndex = categories.findIndex(c => c.toLowerCase() === typeParam);

  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm();

  useEffect(() => {
    reset();
  }, [typeParam, reset]);

  const handleTabChange = (index: number) => {
    const type = categories[index].toLowerCase();
    setSearchParams({ type });
  };

  const onSubmit = (data: any) => {
    setConfirmData({ ...data, type: typeParam });
    setIsOpen(true);
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      if (confirmData.type === 'transfer') {
        await transfer(user?.name || '', confirmData.toAccount, Number(confirmData.amount));
      } else if (confirmData.type === 'deposit') {
        await deposit(user?.name || '', Number(confirmData.amount));
      } else if (confirmData.type === 'withdrawal') {
        await withdraw(user?.name || '', Number(confirmData.amount));
      }

      // Refresh user data
      if (user) {
        const updatedUser = await getAccount(user.name);
        updateUser(updatedUser);
      }

      setIsOpen(false);
      alert('Transaction successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      alert('Transaction failed. Please try again.');
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleRecipientClick = (account: string) => {
    setValue('toAccount', account);
    if (typeParam !== 'transfer') {
        handleTabChange(0); // Switch to transfer
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Form Area */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Money Transfer & Operations</h1>
          
          <Tab.Group selectedIndex={selectedIndex} onChange={handleTabChange}>
            <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 p-1 mb-6">
              {categories.map((category) => (
                <Tab
                  key={category}
                  className={({ selected }) =>
                    cn(
                      'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                      'ring-white/60 ring-offset-2 ring-offset-primary focus:outline-none focus:ring-2',
                      selected
                        ? 'bg-white text-primary shadow'
                        : 'text-gray-500 hover:bg-white/[0.12] hover:text-primary'
                    )
                  }
                >
                  {category}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels>
               {/* Transfer Panel */}
               <Tab.Panel>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label className="block text-sm font-medium text-gray-700">From Account</label>
                        <div className="mt-1">
                          <input
                            type="text"
                            disabled
                            value={`${user?.name} (Balance: ${formatCurrency(user?.balance || 0)})`}
                            className="block w-full rounded-md border-gray-300 bg-gray-50 text-gray-500 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="toAccount" className="block text-sm font-medium text-gray-700">To Account (Username/Email)</label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="toAccount"
                            {...register('toAccount', { required: 'Recipient is required' })}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                          />
                          {errors.toAccount && <p className="text-red-500 text-xs mt-1">{errors.toAccount.message as string}</p>}
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="text-gray-500 sm:text-sm">$</span>
                          </div>
                          <input
                            type="number"
                            id="amount"
                            step="0.01"
                            {...register('amount', { 
                                required: 'Amount is required',
                                min: { value: 0.01, message: 'Amount must be greater than 0' },
                                max: { value: user?.balance || 0, message: 'Insufficient funds' }
                            })}
                            className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-primary focus:ring-primary sm:text-sm"
                            placeholder="0.00"
                          />
                        </div>
                        {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount.message as string}</p>}
                      </div>

                      <div className="sm:col-span-6">
                        <label htmlFor="note" className="block text-sm font-medium text-gray-700">Note (Optional)</label>
                        <div className="mt-1">
                          <textarea
                            id="note"
                            rows={3}
                            {...register('note')}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-5">
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        >
                          Review Transfer
                        </button>
                      </div>
                    </div>
                  </form>
               </Tab.Panel>

               {/* Deposit Panel */}
               <Tab.Panel>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                      <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount to Deposit</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="text-gray-500 sm:text-sm">$</span>
                          </div>
                          <input
                            type="number"
                            id="amount"
                            step="0.01"
                            {...register('amount', { required: 'Amount is required', min: 0.01 })}
                            className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-primary focus:ring-primary sm:text-sm"
                            placeholder="0.00"
                          />
                        </div>
                         {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount.message as string}</p>}
                      </div>
                      <button
                          type="submit"
                          className="w-full justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        >
                          Deposit Funds
                      </button>
                  </form>
               </Tab.Panel>

               {/* Withdrawal Panel */}
               <Tab.Panel>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                      <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount to Withdraw</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="text-gray-500 sm:text-sm">$</span>
                          </div>
                          <input
                            type="number"
                            id="amount"
                            step="0.01"
                             {...register('amount', { 
                                required: 'Amount is required',
                                min: { value: 0.01, message: 'Amount must be greater than 0' },
                                max: { value: user?.balance || 0, message: 'Insufficient funds' }
                            })}
                            className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-primary focus:ring-primary sm:text-sm"
                            placeholder="0.00"
                          />
                        </div>
                        {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount.message as string}</p>}
                      </div>
                      <button
                          type="submit"
                          className="w-full justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                          Withdraw Funds
                      </button>
                  </form>
               </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80">
           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Recipients</h3>
              <div className="flow-root">
                <ul role="list" className="-my-4 divide-y divide-gray-200">
                  {recentRecipients.map((recipient) => (
                    <li key={recipient.account} className="flex items-center py-4 cursor-pointer hover:bg-gray-50 px-2 -mx-2 rounded-md transition-colors" onClick={() => handleRecipientClick(recipient.account)}>
                      <div className="flex-shrink-0">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-500">
                          <span className="font-medium leading-none text-white">{recipient.avatar}</span>
                        </span>
                      </div>
                      <div className="ml-4 flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{recipient.name}</p>
                        <p className="text-sm text-gray-500 truncate">{recipient.account}</p>
                      </div>
                      <div>
                         <ArrowRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6">
                <button
                  type="button"
                  className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                  Add New Recipient
                </button>
              </div>
           </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 flex items-center gap-2"
                  >
                    Confirm Transaction
                  </Dialog.Title>
                  <div className="mt-4 space-y-3">
                    <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-sm text-gray-500">Type</p>
                        <p className="font-medium capitalize">{confirmData?.type}</p>
                    </div>
                    {confirmData?.type === 'transfer' && (
                        <div className="bg-gray-50 p-4 rounded-md">
                            <p className="text-sm text-gray-500">To</p>
                            <p className="font-medium">{confirmData?.toAccount}</p>
                        </div>
                    )}
                    <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-sm text-gray-500">Amount</p>
                        <p className="text-xl font-bold text-primary">{formatCurrency(Number(confirmData?.amount))}</p>
                    </div>
                    {confirmData?.note && (
                        <div className="bg-gray-50 p-4 rounded-md">
                            <p className="text-sm text-gray-500">Note</p>
                            <p className="font-medium">{confirmData?.note}</p>
                        </div>
                    )}
                  </div>

                  <div className="mt-6 flex gap-3 justify-end">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                      onClick={handleConfirm}
                      disabled={loading}
                    >
                      {loading ? 'Processing...' : 'Confirm'}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
