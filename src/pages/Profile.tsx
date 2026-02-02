import { useAuthStore } from '../store/useAuthStore';
import { User } from 'lucide-react';

export default function Profile() {
  const { user } = useAuthStore();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Profile
          </h2>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex items-center">
          <div className="bg-gray-100 p-3 rounded-full mr-4">
            <User className="h-8 w-8 text-gray-500" />
          </div>
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Account Information</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Details about your current account.</p>
          </div>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Account Name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{user?.name || 'N/A'}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Balance</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">${user?.balance?.toFixed(2) || '0.00'}</dd>
            </div>
          </dl>
        </div>
      </div>
      
      <div className="mt-8 bg-white shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Security</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>No password is required for this demo account.</p>
            </div>
        </div>
      </div>
    </div>
  );
}
