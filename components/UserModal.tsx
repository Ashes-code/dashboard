import React from 'react';

type UserDetails = Record<string, any>;

interface UserModalProps {
  open: boolean;
  onClose: () => void;
  loading: boolean;
  error?: string | null;
  details?: UserDetails | null;
  title?: string;
  omitKeys?: string[];
}

const formatKey = (key: string) =>
  key
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^./, (s) => s.toUpperCase());

const renderValue = (value: any) => {
  if (value === null || value === undefined) return <span className="text-gray-500">N/A</span>;
  if (typeof value === 'boolean') return <span className="text-gray-300">{value ? 'True' : 'False'}</span>;
  if (typeof value === 'number') return <span className="text-gray-300">{value}</span>;
  if (typeof value === 'string') return <span className="text-gray-300 break-all">{value}</span>;
  if (value instanceof Date) return <span className="text-gray-300">{value.toLocaleString()}</span>;
  if (Array.isArray(value)) {
    return (
      <div className="space-y-1">
        {value.map((v, i) => (
          <div key={i} className="text-gray-300 text-sm">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</div>
        ))}
      </div>
    );
  }
  if (typeof value === 'object') {
    return <pre className="text-gray-300 text-xs bg-white/5 p-2 rounded whitespace-pre-wrap break-all">{JSON.stringify(value, null, 2)}</pre>;
  }
  return <span className="text-gray-300">{String(value)}</span>;
};

const normalize = (k: string) => k.replace(/[^a-z]/gi, '').toLowerCase();
const DEFAULT_OMIT = new Set([
  'createdat',
  'deletedat',
  'updatedat',
  'id',
  'passwordresetverified',
  'emailverificationexpires',
  'passwordresetexpires',
]);

const UserModal: React.FC<UserModalProps> = ({ open, onClose, loading, error, details, title = 'User Details', omitKeys }) => {
  const omit = new Set([...(omitKeys?.map(normalize) ?? []), ...DEFAULT_OMIT]);
  const entries = details ? Object.entries(details).filter(([k]) => !omit.has(normalize(k))) : [];
  return (
    <div className={`fixed inset-0 z-[60] ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} transition-opacity`}>
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-[#18181b] border border-white/10 rounded-2xl shadow-xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h3 className="text-gray-200 font-semibold">{title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-200 px-2 py-1 rounded">Close</button>
          </div>
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {loading && <div className="text-gray-400">Loading...</div>}
            {!loading && error && <div className="text-red-400">{error}</div>}
            {!loading && !error && details && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {entries.map(([k, v]) => (
                  <div key={k} className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">{formatKey(k)}</div>
                    <div className="text-sm">{renderValue(v)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
