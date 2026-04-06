import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Calendar,
  Dumbbell,
  DollarSign,
  AlertTriangle,
  Activity,
  Building2,
  CheckCircle2,
  Loader2,
  ArrowLeft,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from 'recharts';

const runtimeHost = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const API = import.meta.env.VITE_API_BASE_URL || `http://${runtimeHost}:5001/api`;

const GymOwnerDashboard = () => {
  const navigate = useNavigate();
  const { accessToken, user } = useSelector((s) => s.auth);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creatingGym, setCreatingGym] = useState(false);
  const [createError, setCreateError] = useState('');
  const [createSuccess, setCreateSuccess] = useState('');
  const [gymForm, setGymForm] = useState({
    name: '',
    email: user?.email || '',
    phone: user?.phone || '',
    city: '',
    street: '',
  });

  useEffect(() => {
    const load = async () => {
      if (!accessToken) {
        setLoading(false);
        setError('Please log in to view dashboard data.');
        return;
      }

      try {
        setLoading(true);
        setError('');
        const { data } = await axios.get(`${API}/gyms/owner/dashboard`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setDashboard(data.data || null);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [accessToken]);

  const cards = useMemo(() => {
    const m = dashboard?.metrics || {};
    return [
      { label: 'Active Members', value: m.activeMembers || 0, icon: Users, color: 'from-blue-500 to-blue-700' },
      { label: 'Total Classes', value: m.totalClasses || 0, icon: Calendar, color: 'from-purple-500 to-purple-700' },
      { label: 'Total Trainers', value: m.totalTrainers || 0, icon: Dumbbell, color: 'from-orange-500 to-orange-700' },
      {
        label: 'Monthly Revenue',
        value: `$${(m.monthlyRevenue || 0).toLocaleString()}`,
        icon: DollarSign,
        color: 'from-green-500 to-green-700',
      },
    ];
  }, [dashboard]);

  const handleCreateGym = async (e) => {
    e.preventDefault();
    if (!accessToken) return;

    try {
      setCreateError('');
      setCreateSuccess('');
      setCreatingGym(true);

      await axios.post(
        `${API}/gyms`,
        {
          name: gymForm.name,
          email: gymForm.email,
          phone: gymForm.phone,
          address: {
            street: gymForm.street,
            city: gymForm.city,
            country: 'USA',
          },
          description: 'Modern fitness center focused on member transformation.',
          amenities: 'Strength Zone,Cardio Deck,Locker Rooms',
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      setCreateSuccess('Gym created successfully. Loading analytics...');

      const { data } = await axios.get(`${API}/gyms/owner/dashboard`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setDashboard(data.data || null);
    } catch (err) {
      setCreateError(err?.response?.data?.message || 'Unable to create gym profile right now.');
    } finally {
      setCreatingGym(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-white">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-gray-100 transition hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <h1 className="text-3xl md:text-4xl font-bold">Gym Owner Dashboard</h1>
        <p className="text-gray-400 mt-2">
          Welcome back, {user?.firstName || 'Owner'}. Live operations for {dashboard?.gym?.name || 'your gym'}.
        </p>
      </motion.div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 mb-8">
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {!loading && !error && dashboard && (
        <>
          {dashboard.requiresSetup && (
            <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-lg bg-yellow-400/20 p-2">
                  <Building2 className="w-5 h-5 text-yellow-300" />
                </div>
                <div className="flex-1">
                  <p className="text-yellow-200 text-sm font-semibold">
                    No gym profile is linked to this owner yet. Create your gym first to unlock live analytics.
                  </p>
                  <p className="text-yellow-100/80 text-xs mt-1">
                    Fill in the form below and we will instantly connect the gym to this dashboard.
                  </p>
                </div>
              </div>

              <form onSubmit={handleCreateGym} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Gym name"
                  value={gymForm.name}
                  onChange={(e) => setGymForm((p) => ({ ...p, name: e.target.value }))}
                  className="rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <input
                  type="email"
                  required
                  placeholder="Gym email"
                  value={gymForm.email}
                  onChange={(e) => setGymForm((p) => ({ ...p, email: e.target.value }))}
                  className="rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <input
                  type="text"
                  required
                  placeholder="Phone"
                  value={gymForm.phone}
                  onChange={(e) => setGymForm((p) => ({ ...p, phone: e.target.value }))}
                  className="rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <input
                  type="text"
                  required
                  placeholder="City"
                  value={gymForm.city}
                  onChange={(e) => setGymForm((p) => ({ ...p, city: e.target.value }))}
                  className="rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <input
                  type="text"
                  required
                  placeholder="Street"
                  value={gymForm.street}
                  onChange={(e) => setGymForm((p) => ({ ...p, street: e.target.value }))}
                  className="md:col-span-2 rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />

                <button
                  type="submit"
                  disabled={creatingGym}
                  className="md:col-span-2 inline-flex items-center justify-center gap-2 rounded-lg bg-yellow-500 px-4 py-2.5 text-sm font-semibold text-black hover:bg-yellow-400 disabled:opacity-70"
                >
                  {creatingGym ? <Loader2 className="h-4 w-4 animate-spin" /> : <Building2 className="h-4 w-4" />}
                  {creatingGym ? 'Creating gym...' : 'Create Gym Profile'}
                </button>
              </form>

              {createError && <p className="mt-2 text-xs text-red-300">{createError}</p>}
              {createSuccess && (
                <p className="mt-2 text-xs text-emerald-300 inline-flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> {createSuccess}
                </p>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {cards.map((card) => (
              <div key={card.label} className="bg-white/5 rounded-xl p-5 border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2.5 rounded-lg bg-gradient-to-br ${card.color}`}>
                    <card.icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm text-gray-400">{card.label}</span>
                </div>
                <p className="text-2xl font-bold">{card.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-accent" /> Revenue Trend
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dashboard.monthlyRevenue || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                    <XAxis dataKey="label" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip />
                    <Area type="monotone" dataKey="revenue" stroke="#22c55e" fill="#22c55e44" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="font-semibold mb-4">Today&apos;s Classes</h3>
              <div className="space-y-3">
                {(dashboard.todayClasses || []).length === 0 && (
                  <p className="text-sm text-gray-400">No classes scheduled for today.</p>
                )}
                {(dashboard.todayClasses || []).map((cls) => (
                  <div key={cls._id} className="bg-white/5 rounded-lg p-3">
                    <p className="font-medium">{cls.name}</p>
                    <p className="text-xs text-gray-400">
                      {cls.schedule?.time || 'Time not set'} • {cls.currentBookings || 0}/{cls.maxCapacity || 0} booked
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="font-semibold mb-4">Recent Bookings</h3>
              <div className="space-y-3">
                {(dashboard.recentBookings || []).length === 0 && (
                  <p className="text-sm text-gray-400">No recent bookings available.</p>
                )}
                {(dashboard.recentBookings || []).map((b) => (
                  <div key={b._id} className="bg-white/5 rounded-lg p-3">
                    <p className="font-medium">{b.memberName || 'Member'} booked {b.className || 'a class'}</p>
                    <p className="text-xs text-gray-400">{new Date(b.bookedAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" /> Alerts
              </h3>
              <div className="space-y-3">
                {(dashboard.alerts || []).length === 0 && (
                  <p className="text-sm text-gray-400">No operational alerts right now.</p>
                )}
                {(dashboard.alerts || []).map((a, idx) => (
                  <div key={idx} className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-sm text-yellow-200">
                    {a.message}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-5 mt-6">
            <h3 className="font-semibold mb-4">Class Capacity Snapshot</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={(dashboard.classes || []).map((c) => ({ name: c.name, booked: c.currentBookings, capacity: c.maxCapacity }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip />
                  <Bar dataKey="booked" fill="#60a5fa" />
                  <Bar dataKey="capacity" fill="#a78bfa" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GymOwnerDashboard;
