import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';
import { getAccount, createAccount } from '../services/banking';
import { useAuthStore } from '../store/useAuthStore';
import { cn } from '../lib/utils';

const schema = yup.object({
  name: yup.string().required('Account name is required'),
}).required();

type FormData = yup.InferType<typeof schema>;

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { login: setAuth } = useAuthStore();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema) as any,
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    try {
      if (isCreating) {
        await createAccount(data.name, 1000); // Default initial balance
        // After creating, fetch the account
      }
      const account = await getAccount(data.name);
      setAuth(account);
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 404 && !isCreating) {
        setError('Account not found. Would you like to create it?');
      } else if (err.response?.status === 404 && isCreating) {
        setError('Failed to create account.');
      } else {
         setError('An error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
            <div className="bg-primary p-3 rounded-full">
                <User className="h-8 w-8 text-white" />
            </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          {isCreating ? 'Create new account' : 'Access your account'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          This demo backend uses account names as identifiers. No password required.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex flex-col">
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                  {error.includes('not found') && (
                     <button 
                       type="button"
                       onClick={() => { setIsCreating(true); setError(null); }}
                       className="mt-2 text-sm text-red-700 underline hover:text-red-900 text-left ml-3"
                     >
                       Switch to Create Account
                     </button>
                  )}
                </div>
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Account Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="name"
                  type="text"
                  autoComplete="username"
                  className={cn(
                    "block w-full pl-10 sm:text-sm rounded-md",
                    errors.name 
                      ? "border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-primary focus:border-primary"
                  )}
                  {...register('name')}
                />
              </div>
              {errors.name && (
                <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
              >
                {loading ? 'Processing...' : (isCreating ? 'Create Account' : 'Access Account')}
              </button>
            </div>
            
            <div className="text-center">
                 <button 
                   type="button"
                   onClick={() => { setIsCreating(!isCreating); setError(null); }}
                   className="text-sm text-primary hover:text-primary-hover"
                 >
                   {isCreating ? 'Already have an account? Access it' : 'Need an account? Create one'}
                 </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
