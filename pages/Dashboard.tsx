
import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import StatCard from '../components/StatCard';
import UserTable from '../components/UserTable';
import VaccineTrends from '../components/VaccineTrends';
import UserModal from '../components/UserModal';
import { Status, UserRecord, UserType, StatData } from '../types';
import { Users, MessageCircle, Heart, Bell } from 'lucide-react';

interface DashboardProps {
  onLogout: () => void;
}

type DashboardApi = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    stats: {
      totalPatients: number;
      totalPharmacies: number;
      totalBookings: number;
      completedVaccinations: number;
    };
    latestUsers: Array<{
      id: string;
      role: 'pharmacy' | 'patient';
      email: string;
      accountStatus: string;
      createdAt: string;
    }>;
    recentVerifications: Array<{
      id: string;
      role: 'pharmacy' | 'patient';
      accountStatus: string;
      updatedAt: string;
    }>;
    vaccineTrends: Array<{
      name?: string;
      value?: number;
      [key: string]: unknown;
    }>;
  };
};

const API_URL = (import.meta as any).env?.VITE_API_URL;

const roleToUserType = (role: string): UserType =>
  role.toLowerCase() === 'pharmacy' ? UserType.Pharmacy : UserType.Patient;

const statusToEnum = (status: string): Status => {
  const s = status.toLowerCase();
  if (s.includes('active') || s.includes('verify') || s === 'verified') return Status.Verified;
  return Status.Pending;
};

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [stats, setStats] = useState<StatData[]>([]);
  const [latestUsers, setLatestUsers] = useState<UserRecord[]>([]);
  const [recentVerifications, setRecentVerifications] = useState<UserRecord[]>([]);
  const [vaccineTrends, setVaccineTrends] = useState<Array<{ name: string; value: number }>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [detailOpen, setDetailOpen] = useState<boolean>(false);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [detailData, setDetailData] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(API_URL, { headers: { 'Accept': 'application/json' } });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const json: DashboardApi = await res.json();
        if (!json?.data) throw new Error('Invalid response');
        if (!mounted) return;

        const s = json.data.stats;
        const newStats: StatData[] = [
          {
            title: 'Total Patients',
            value: s.totalPatients,
            change: '',
            trend: 'up',
            color: '#3b82f6',
            icon: <Users className="w-5 h-5 text-blue-400" />,
            chartData: [],
          },
          {
            title: 'Total Pharmacies',
            value: s.totalPharmacies,
            change: '',
            trend: 'up',
            color: '#f97316',
            icon: <MessageCircle className="w-5 h-5 text-orange-400" />,
            chartData: [],
          },
          {
            title: 'Total Bookings',
            value: s.totalBookings,
            change: '',
            trend: 'up',
            color: '#ef4444',
            icon: <Heart className="w-5 h-5 text-red-400" />,
            chartData: [],
          },
          {
            title: 'Completed Vaccinations',
            value: s.completedVaccinations,
            change: '',
            trend: 'up',
            color: '#22c55e',
            icon: <Bell className="w-5 h-5 text-green-400" />,
            chartData: [],
          },
        ];

        const latest = json.data.latestUsers?.map<UserRecord>((u) => ({
          id: u.id,
          fullName: u.email?.split('@')[0] || u.id,
          userType: roleToUserType(u.role),
          email: u.email,
          registrationDate: new Date(u.createdAt).toLocaleDateString(),
          status: statusToEnum(u.accountStatus),
        })) ?? [];

        const verifications = json.data.recentVerifications?.map<UserRecord>((v) => ({
          id: v.id,
          fullName: v.role.charAt(0).toUpperCase() + v.role.slice(1),
          userType: roleToUserType(v.role),
          email: 'N/A',
          registrationDate: new Date(v.updatedAt).toLocaleDateString(),
          status: statusToEnum(v.accountStatus),
        })) ?? [];

        const trendsRaw = (json.data.vaccineTrends ?? []) as Array<Record<string, unknown>>;
        const trends = trendsRaw
          .map((t, idx) => {
            const name = typeof t.name === 'string' ? t.name : `Trend ${idx + 1}`;
            const value = typeof t.value === 'number' ? t.value : 0;
            return { name, value };
          })
          .filter((t) => t.value > 0);

        setStats(newStats);
        setLatestUsers(latest);
        setRecentVerifications(verifications);
        setVaccineTrends(trends);
        setError(null);
      } catch (e: any) {
        setError(e?.message ?? 'Failed to load dashboard data');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const USER_DETAIL_URLS_RAW =
    ((import.meta as any).env?.VITE_USER_DETAIL_URLS as string | undefined) ??
    ((import.meta as any).env?.VITE_USER_DETAIL_URL as string | undefined) ??
    '';

  const USER_DETAIL_BUILDERS: Array<(id: string) => string> = USER_DETAIL_URLS_RAW
    ? USER_DETAIL_URLS_RAW.split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((tpl) => (id: string) =>
          tpl.includes(':id')
            ? tpl.replace(':id', encodeURIComponent(id))
            : `${tpl.replace(/\/+$/, '')}/${encodeURIComponent(id)}`
        )
    : [];

  const openUserDetail = async (user: UserRecord) => {
    setDetailOpen(true);
    setDetailLoading(true);
    setDetailError(null);
    setDetailData(null);
    const baseDetails: Record<string, any> = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      userType: user.userType,
      status: user.status,
      registrationDate: user.registrationDate,
    };
    try {
      let fetched: any | null = null;
      if (USER_DETAIL_BUILDERS.length > 0) {
        for (const build of USER_DETAIL_BUILDERS) {
          try {
            const url = build(user.id);
            const res = await fetch(url, { headers: { Accept: 'application/json' } });
            if (res.ok) {
              const j = await res.json();
              fetched = j?.data ?? j;
              break;
            }
          } catch {
            // try next candidate
          }
        }
      }
      setDetailData({ ...baseDetails, ...(fetched || {}) });
    } catch (e: any) {
      setDetailError(e?.message ?? 'Failed to load user details');
      setDetailData(baseDetails);
    } finally {
      setDetailLoading(false);
    }
  };

  const content = useMemo(() => {
    if (loading) {
      return (
        <div className="flex-1 p-4 lg:ml-64 md:p-8">
          <TopBar onMenuClick={() => setSidebarOpen(true)} />
          <div className="mt-8 text-gray-400 flex items-center justify-center">Loading dashboard...</div>
        </div>
      );
    }
    if (error) {
      return (
        <div className="flex-1 p-4 lg:ml-64 md:p-8">
          <TopBar onMenuClick={() => {}} />
          <div className="mt-8 text-red-400">Error: {error}</div>
        </div>
      );
    }
    return (
      <main className="flex-1 p-4 lg:p-6 lg:ml-64">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <StatCard key={idx} data={stat} />
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <UserTable 
              title="Latest Users"
              users={latestUsers}
              onView={openUserDetail}
              showOperation={true}
            />
            <UserTable 
              title="Recent Verifications" 
              users={recentVerifications} 
              showOperation={false}
            />
          </div>
          
          <div className="lg:col-span-1">
            <VaccineTrends data={vaccineTrends} />
          </div>
        </div>
      </main>
    );
  }, [loading, error, stats, latestUsers, recentVerifications, vaccineTrends]);

  return (
    <div className="flex min-h-screen bg-[#0c0c0e]">
      <Sidebar onLogout={onLogout} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div
        className={`fixed inset-0 bg-black/50 md:hidden transition-opacity ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setSidebarOpen(false)}
      />
      {content}
      <UserModal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        loading={detailLoading}
        error={detailError}
        details={detailData}
        title="User Details"
      />
    </div>
  );
};

export default Dashboard;
