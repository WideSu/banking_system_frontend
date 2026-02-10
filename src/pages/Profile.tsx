import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../store/useAuthStore';
import { User, Camera, Save, Mail, Phone, MapPin, Shield } from 'lucide-react';

export default function Profile() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      fullName: 'John Doe', // Mock default
      email: user?.name || '',
      phone: '+1 (555) 123-4567',
      address: '123 Banking St, Finance City, FC 90210'
    }
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    setSuccessMessage(null);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccessMessage('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h1>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Header / Avatar */}
            <div className="flex flex-col sm:flex-row items-center mb-8">
              <div className="relative group">
                <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-sm overflow-hidden">
                  <User className="h-12 w-12 text-gray-400" />
                </div>
                <button type="button" className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full shadow-md hover:bg-primary-hover focus:outline-none">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
                <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                <p className="text-sm text-gray-500">Personal Account</p>
              </div>
            </div>

            {successMessage && (
               <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-sm text-green-700">{successMessage}</p>
                    </div>
                  </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              {/* Full Name */}
              <div className="sm:col-span-3">
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                   </div>
                   <input
                    type="text"
                    id="fullName"
                    {...register('fullName')}
                    className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="sm:col-span-3">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                   </div>
                   <input
                    type="email"
                    id="email"
                    disabled // Read-only as it's the ID
                    {...register('email')}
                    className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Email cannot be changed.</p>
              </div>

              {/* Phone */}
              <div className="sm:col-span-3">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                   </div>
                   <input
                    type="tel"
                    id="phone"
                    {...register('phone')}
                    className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="sm:col-span-6">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                   </div>
                   <input
                    type="text"
                    id="address"
                    {...register('address')}
                    className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className="mt-10 border-t border-gray-200 pt-8">
               <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4 flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-gray-500" />
                  Security
               </h3>
               <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Current Password</label>
                    <input type="password" disabled className="mt-1 block w-full sm:text-sm border-gray-300 rounded-md bg-gray-50 cursor-not-allowed" placeholder="••••••••" />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">New Password</label>
                    <input type="password" disabled className="mt-1 block w-full sm:text-sm border-gray-300 rounded-md bg-gray-50 cursor-not-allowed" placeholder="••••••••" />
                  </div>
               </div>
               <p className="mt-2 text-sm text-gray-500">Password change is disabled for this demo.</p>
            </div>

            {/* Actions */}
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary mr-3"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
