import React from 'react';
import { UserType, Status } from '../types';

export type SimpleUser = {
  id: string;
  name: string;
  email: string;
  userType: UserType;
  profileStatus: Status | string;
};

interface UsersModalProps {
  open: boolean;
  onClose: () => void;
  loading: boolean;
  error?: string | null;
  users: SimpleUser[];
}

const UsersModal: React.FC<UsersModalProps> = ({ open, onClose, loading, error, users }) => {
  return (
    <div className={`fixed inset-0 z-[70] ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} transition-opacity`}>
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-[#18181b] border border-white/10 rounded-2xl shadow-xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h3 className="text-gray-200 font-semibold">All Users</h3>
            <div className="text-sm text-gray-400">Total: {users.length}</div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-200 px-2 py-1 rounded">Close</button>
          </div>
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {loading && <div className="text-gray-400">Loading...</div>}
            {!loading && error && <div className="text-red-400">{error}</div>}
            {!loading && !error && (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-gray-500 text-xs uppercase tracking-wider border-b border-white/5">
                      <th className="pb-4 font-semibold">Name</th>
                      <th className="pb-4 font-semibold">Email</th>
                      <th className="pb-4 font-semibold">User Type</th>
                      <th className="pb-4 font-semibold">Profile Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {users.map((u) => (
                      <tr key={u.id} className="text-sm group hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 text-gray-300">{u.name}</td>
                        <td className="py-3 text-gray-400">{u.email}</td>
                        <td className="py-3 text-gray-400">{u.userType}</td>
                        <td className="py-3">
                          <span className="text-gray-400">{u.profileStatus}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersModal;
