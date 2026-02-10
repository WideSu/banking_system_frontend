import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Mail, Github, Chrome } from 'lucide-react'; // Using Chrome as a proxy for Google
import { getAccount, createAccount } from '../services/banking';
import { useAuthStore } from '../store/useAuthStore';
import { cn } from '../lib/utils';

// Schema for Login
const loginSchema = yup.object({
  email: yup.string().required('Username/Email is required'),
  password: yup.string().required('Password is required'),
}).required();

// Schema for Signup
const signupSchema = yup.object({
  email: yup.string().required('Username/Email is required'),
  password: yup.string().required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
  terms: yup.boolean().oneOf([true], 'You must accept the terms and conditions'),
}).required();

type LoginForm = yup.InferType<typeof loginSchema>;
type SignupForm = yup.InferType<typeof signupSchema>;

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  
  const { login: setAuth } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<any>({
    resolver: yupResolver(isSignup ? signupSchema : loginSchema),
  });

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setAuthError(null);
    reset();
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    setAuthError(null);
    const username = data.email; // Using email field as username

    try {
      if (isSignup) {
        // Create account
        await createAccount(username, 1000); // Default initial balance
        // Auto login after creation
        const account = await getAccount(username);
        setAuth(account);
        navigate('/dashboard');
      } else {
        // Login (Get Account)
        // Note: Password is ignored by the current demo backend
        const account = await getAccount(username);
        setAuth(account);
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 404) {
        if (!isSignup) {
            setAuthError('Account not found. Please sign up.');
        } else {
            setAuthError('Failed to create account. Please try again.');
        }
      } else {
        setAuthError(err.message || 'An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
            <div className="bg-primary p-3 rounded-full">
                <User className="h-8 w-8 text-white" />
            </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          {isSignup ? 'Create your account' : 'Sign in to your account'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {isSignup ? 'Start your financial journey today' : 'Welcome back!'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {authError && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{authError}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address / Username
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  type="text"
                  autoComplete="username"
                  className={cn(
                    "block w-full pl-10 sm:text-sm rounded-md py-2 border",
                    errors.email
                      ? "border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-primary focus:border-primary"
                  )}
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email.message as string}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  type="password"
                  autoComplete={isSignup ? "new-password" : "current-password"}
                  className={cn(
                    "block w-full pl-10 sm:text-sm rounded-md py-2 border",
                    errors.password
                      ? "border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-primary focus:border-primary"
                  )}
                  {...register('password')}
                />
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password.message as string}</p>
              )}
            </div>

            {isSignup && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    className={cn(
                      "block w-full pl-10 sm:text-sm rounded-md py-2 border",
                      errors.confirmPassword
                        ? "border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-primary focus:border-primary"
                    )}
                    {...register('confirmPassword')}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message as string}</p>
                )}
              </div>
            )}

            {!isSignup && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-primary hover:text-primary-hover">
                    Forgot your password?
                  </a>
                </div>
              </div>
            )}

            {isSignup && (
               <div className="flex items-center">
                <input
                  id="terms"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  {...register('terms')}
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                  I agree to the <a href="#" className="text-primary hover:text-primary-hover">Terms and Conditions</a>
                </label>
              </div>
            )}
             {errors.terms && (
                <p className="mt-2 text-sm text-red-600">{errors.terms.message as string}</p>
              )}


            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? 'Processing...' : (isSignup ? 'Sign up' : 'Sign in')}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div>
                <a
                  href="#"
                  className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
                >
                  <span className="sr-only">Sign in with Google</span>
                  <Chrome className="h-5 w-5" />
                </a>
              </div>
              <div>
                <a
                  href="#"
                  className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
                >
                  <span className="sr-only">Sign in with Facebook</span>
                  <Github className="h-5 w-5" /> {/* Using Github as proxy for Facebook since lucide might not have facebook in this version or I want to be safe */}
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center">
             <p className="text-sm text-gray-600">
                {isSignup ? "Already have an account? " : "Don't have an account? "}
                <button 
                    onClick={toggleMode} 
                    className="font-medium text-primary hover:text-primary-hover"
                >
                    {isSignup ? "Sign in" : "Sign up"}
                </button>
             </p>
          </div>

        </div>
      </div>
    </div>
  );
}
