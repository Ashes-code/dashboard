
import React from 'react';
import { UserRecord, UserType, Status } from '../types';

interface UserTableProps {
  title: string;
  users: UserRecord[];
  showOperation?: boolean;
  onView?: (user: UserRecord) => void;
}

const UserTable: React.FC<UserTableProps> = ({ title, users, showOperation = true, onView }) => {
  const getTypeColor = (type: UserType) => {
    switch (type) {
      case UserType.Patient:
        return 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20';
      case UserType.Pharmacy:
        return 'bg-orange-500/10 text-orange-400 border border-orange-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400';
    }
  };

  const getStatusColor = (status: Status) => {
    switch (status) {
      case Status.Verified:
        return 'text-gray-400';
      case Status.Pending:
        return 'text-gray-500';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="bg-[#18181b] p-4 rounded-2xl border border-white/5 overflow-x-auto">
      <h3 className="text-gray-300 text-lg font-medium mb-6">{title}</h3>
      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-500 text-xs uppercase tracking-wider border-b border-white/5">
            <th className="pb-4 font-semibold text-xs">Full Name</th>
            <th className="pb-4 font-semibold">User Type</th>
            {showOperation && <th className="pb-4 font-semibold">E-mail</th>}
            <th className="pb-4 font-semibold">{showOperation ? 'Registration Date' : 'Create Date'}</th>
            <th className="pb-4 font-semibold">Status</th>
            {showOperation && <th className="pb-4 font-semibold">Operation</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {users.map((user) => (
            <tr key={user.id} className="text-sm group hover:bg-white/[0.02] transition-colors">
              <td className="py-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold ${getTypeColor(user.userType)}`}>
                    {user.fullName.charAt(0)}
                  </div>
                  <span className="text-gray-300">{user.fullName}</span>
                </div>
              </td>
              <td className="py-4">
                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${getTypeColor(user.userType)}`}>
                  {user.userType}
                </span>
              </td>
              {showOperation && <td className="py-4 text-gray-400">{user.email}</td>}
              <td className="py-4 text-gray-400">{user.registrationDate}</td>
              <td className="py-4">
                <span className={getStatusColor(user.status)}>{user.status}</span>
              </td>
              {showOperation && (
                <td className="py-4">
                  <div className="flex space-x-3 text-xs font-medium">
                    <button
                      className="text-emerald-500 hover:underline"
                      onClick={() => onView && onView(user)}
                    >
                      View
                    </button>
                    <button className="text-rose-500 hover:underline">Delete</button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
