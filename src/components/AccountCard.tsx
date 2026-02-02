import { Account } from '../types/account';
import { CreditCard } from 'lucide-react';

interface AccountCardProps {
  account: Account;
}

export default function AccountCard({ account }: AccountCardProps) {
  return (
    <div className="bg-white overflow-hidden rounded-lg shadow">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <CreditCard className="h-6 w-6 text-gray-400" aria-hidden="true" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="truncate text-sm font-medium text-gray-500">
                ACCOUNT - {account.name}
              </dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">${account.balance.toFixed(2)}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-5 py-3">
        <div className="text-sm">
          <span className="font-medium text-success">
            Active
          </span>
        </div>
      </div>
    </div>
  );
}
