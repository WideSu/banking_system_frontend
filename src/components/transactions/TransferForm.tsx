import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuthStore } from '../../store/useAuthStore';
import { transfer } from '../../services/banking';
import { cn } from '../../lib/utils';

const schema = yup.object({
  amount: yup.number().typeError('Amount must be a number').positive('Amount must be positive').required('Amount is required'),
  targetAccountName: yup.string().required('Target Account Name is required'),
}).required();

type FormData = yup.InferType<typeof schema>;

export default function TransferForm({ onSuccess }: { onSuccess: () => void }) {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: yupResolver(schema) as any,
  });

  const onSubmit = async (data: FormData) => {
    if (!user) return;
    setLoading(true);
    setError(null);

    if (user.balance < data.amount) {
        setError('Insufficient funds in source account');
        setLoading(false);
        return;
    }

    if (user.name === data.targetAccountName) {
        setError('Cannot transfer to the same account');
        setLoading(false);
        return;
    }

    try {
      await transfer(user.name, data.targetAccountName, data.amount);
      reset();
      onSuccess();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
      return <div>Please login first</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Source Account
        </label>
        <div className="mt-1 p-2 bg-gray-100 rounded-md">
            {user.name} (Balance: ${user.balance.toFixed(2)})
        </div>
      </div>

      <div>
        <label htmlFor="targetAccountName" className="block text-sm font-medium text-gray-700">
          Target Account Name
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="targetAccountName"
            className={cn(
              "shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md",
               errors.targetAccountName ? "border-red-300" : ""
            )}
            placeholder="Enter destination account name"
            {...register('targetAccountName')}
          />
        </div>
        {errors.targetAccountName && <p className="mt-2 text-sm text-red-600">{errors.targetAccountName.message}</p>}
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
          Amount
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div>
          <input
            type="number"
            step="0.01"
            id="amount"
            className={cn(
              "focus:ring-primary focus:border-primary block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md",
              errors.amount ? "border-red-300" : ""
            )}
            placeholder="0.00"
            {...register('amount')}
          />
        </div>
        {errors.amount && <p className="mt-2 text-sm text-red-600">{errors.amount.message}</p>}
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Transfer Funds'}
        </button>
      </div>
    </form>
  );
}
