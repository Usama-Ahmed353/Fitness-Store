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
  Plus,
  UserPlus,
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
  const [classesLive, setClassesLive] = useState([]);
  const [trainersLive, setTrainersLive] = useState([]);
  const [opsLoading, setOpsLoading] = useState(false);
  const [opsError, setOpsError] = useState('');
  const [classSaving, setClassSaving] = useState(false);
  const [trainerSaving, setTrainerSaving] = useState(false);
  const [opsSuccess, setOpsSuccess] = useState('');
  const [classForm, setClassForm] = useState({
    name: '',
    category: 'strength',
    duration: 60,
    maxCapacity: 20,
    dayOfWeek: 'monday',
    time: '09:00',
    difficulty: 'intermediate',
    location: '',
    instructorId: '',
  });
  const [trainerForm, setTrainerForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    hourlyRate: 50,
    specializations: '',
    certifications: '',
    yearsExperience: 1,
    bio: '',
  });
  const [gymForm, setGymForm] = useState({
    name: '',
    email: user?.email || '',
    phone: user?.phone || '',
    city: '',
    street: '',
  });

  const loadOwnerOperationalData = async (gymId, token = accessToken) => {
    if (!gymId || !token) return;
    try {
      setOpsLoading(true);
      setOpsError('');

      const [clsRes, trainerRes] = await Promise.all([
        axios.get(`${API}/classes`, { params: { gymId, limit: 100 } }),
        axios.get(`${API}/trainers`, { params: { gymId, limit: 100 } }),
      ]);

      setClassesLive(clsRes.data?.data || []);
      setTrainersLive(trainerRes.data?.data || []);
    } catch (err) {
      setOpsError(err?.response?.data?.message || 'Failed to load classes/trainers');
    } finally {
      setOpsLoading(false);
    }
  };

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
        if (data?.data?.gym?._id) {
          await loadOwnerOperationalData(data.data.gym._id, accessToken);
        }
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
      if (data?.data?.gym?._id) {
        await loadOwnerOperationalData(data.data.gym._id, accessToken);
      }
    } catch (err) {
      setCreateError(err?.response?.data?.message || 'Unable to create gym profile right now.');
    } finally {
      setCreatingGym(false);
    }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    if (!accessToken || !dashboard?.gym?._id) return;

    try {
      setClassSaving(true);
      setOpsError('');
      setOpsSuccess('');

      await axios.post(
        `${API}/classes`,
        {
          gymId: dashboard.gym._id,
          name: classForm.name,
          category: classForm.category,
          instructorId: classForm.instructorId || undefined,
          duration: Number(classForm.duration),
          maxCapacity: Number(classForm.maxCapacity),
          schedule: {
            dayOfWeek: classForm.dayOfWeek,
            time: classForm.time,
            recurring: true,
          },
          location: classForm.location,
          difficulty: classForm.difficulty,
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      setOpsSuccess('Class created successfully');
      setClassForm({
        name: '',
        category: 'strength',
        duration: 60,
        maxCapacity: 20,
        dayOfWeek: 'monday',
        time: '09:00',
        difficulty: 'intermediate',
        location: '',
        instructorId: '',
      });
      await loadOwnerOperationalData(dashboard.gym._id, accessToken);
    } catch (err) {
      setOpsError(err?.response?.data?.message || 'Failed to create class');
    } finally {
      setClassSaving(false);
    }
  };

  const handleCreateTrainer = async (e) => {
    e.preventDefault();
    if (!accessToken || !dashboard?.gym?._id) return;

    try {
      setTrainerSaving(true);
      setOpsError('');
      setOpsSuccess('');

      await axios.post(
        `${API}/trainers`,
        {
          gymId: dashboard.gym._id,
          firstName: trainerForm.firstName,
          lastName: trainerForm.lastName,
          email: trainerForm.email,
          password: trainerForm.password,
          phone: trainerForm.phone,
          hourlyRate: Number(trainerForm.hourlyRate),
          specializations: trainerForm.specializations,
          certifications: trainerForm.certifications,
          yearsExperience: Number(trainerForm.yearsExperience),
          bio: trainerForm.bio,
          availability: { days: ['monday', 'wednesday', 'friday'], timeSlots: ['09:00', '17:00'] },
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      setOpsSuccess('Trainer created successfully');
      setTrainerForm({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        hourlyRate: 50,
        specializations: '',
        certifications: '',
        yearsExperience: 1,
        bio: '',
      });
      await loadOwnerOperationalData(dashboard.gym._id, accessToken);
    } catch (err) {
      setOpsError(err?.response?.data?.message || 'Failed to create trainer');
    } finally {
      setTrainerSaving(false);
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

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><Plus className="w-5 h-5 text-accent" /> Add Live Class</h3>
              <form onSubmit={handleCreateClass} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input required value={classForm.name} onChange={(e) => setClassForm((p) => ({ ...p, name: e.target.value }))} placeholder="Class name" className="rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-sm" />
                <select value={classForm.category} onChange={(e) => setClassForm((p) => ({ ...p, category: e.target.value }))} className="rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-sm">
                  <option value="strength">Strength</option><option value="cardio">Cardio</option><option value="hiit">HIIT</option><option value="mind_body">Mind Body</option><option value="ride">Ride</option><option value="dance">Dance</option><option value="specialty">Specialty</option>
                </select>
                <input type="number" min="15" value={classForm.duration} onChange={(e) => setClassForm((p) => ({ ...p, duration: e.target.value }))} placeholder="Duration" className="rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-sm" />
                <input type="number" min="1" value={classForm.maxCapacity} onChange={(e) => setClassForm((p) => ({ ...p, maxCapacity: e.target.value }))} placeholder="Max capacity" className="rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-sm" />
                <input value={classForm.dayOfWeek} onChange={(e) => setClassForm((p) => ({ ...p, dayOfWeek: e.target.value }))} placeholder="Day of week" className="rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-sm" />
                <input type="time" value={classForm.time} onChange={(e) => setClassForm((p) => ({ ...p, time: e.target.value }))} className="rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-sm" />
                <select value={classForm.difficulty} onChange={(e) => setClassForm((p) => ({ ...p, difficulty: e.target.value }))} className="rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-sm">
                  <option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option>
                </select>
                <input value={classForm.location} onChange={(e) => setClassForm((p) => ({ ...p, location: e.target.value }))} placeholder="Location" className="rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-sm" />
                <select value={classForm.instructorId} onChange={(e) => setClassForm((p) => ({ ...p, instructorId: e.target.value }))} className="md:col-span-2 rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-sm">
                  <option value="">No instructor</option>
                  {trainersLive.map((t) => <option key={t._id} value={t._id}>{`${t.userId?.firstName || ''} ${t.userId?.lastName || ''}`.trim() || 'Trainer'}</option>)}
                </select>
                <button disabled={classSaving} type="submit" className="md:col-span-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-70">
                  {classSaving ? 'Saving class...' : 'Create Class'}
                </button>
              </form>

              <div className="mt-4 space-y-2 max-h-56 overflow-auto">
                {opsLoading ? <p className="text-sm text-gray-400">Loading classes...</p> : classesLive.map((c) => <div key={c._id} className="rounded-lg bg-white/5 p-2 text-sm">{c.name} • {c.schedule?.dayOfWeek || '-'} {c.schedule?.time || ''}</div>)}
                {!opsLoading && classesLive.length === 0 && <p className="text-sm text-gray-400">No classes yet.</p>}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><UserPlus className="w-5 h-5 text-accent" /> Add Live Trainer</h3>
              <form onSubmit={handleCreateTrainer} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input required value={trainerForm.firstName} onChange={(e) => setTrainerForm((p) => ({ ...p, firstName: e.target.value }))} placeholder="First name" className="rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-sm" />
                <input required value={trainerForm.lastName} onChange={(e) => setTrainerForm((p) => ({ ...p, lastName: e.target.value }))} placeholder="Last name" className="rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-sm" />
                <input required type="email" value={trainerForm.email} onChange={(e) => setTrainerForm((p) => ({ ...p, email: e.target.value }))} placeholder="Email" className="rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-sm" />
                <input required type="password" value={trainerForm.password} onChange={(e) => setTrainerForm((p) => ({ ...p, password: e.target.value }))} placeholder="Password" className="rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-sm" />
                <input value={trainerForm.phone} onChange={(e) => setTrainerForm((p) => ({ ...p, phone: e.target.value }))} placeholder="Phone" className="rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-sm" />
                <input type="number" min="0" value={trainerForm.hourlyRate} onChange={(e) => setTrainerForm((p) => ({ ...p, hourlyRate: e.target.value }))} placeholder="Hourly rate" className="rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-sm" />
                <input value={trainerForm.specializations} onChange={(e) => setTrainerForm((p) => ({ ...p, specializations: e.target.value }))} placeholder="Specializations (comma separated)" className="md:col-span-2 rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-sm" />
                <textarea value={trainerForm.bio} onChange={(e) => setTrainerForm((p) => ({ ...p, bio: e.target.value }))} placeholder="Trainer bio" className="md:col-span-2 rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-sm" rows={3} />
                <button disabled={trainerSaving} type="submit" className="md:col-span-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-70">
                  {trainerSaving ? 'Saving trainer...' : 'Create Trainer'}
                </button>
              </form>

              <div className="mt-4 space-y-2 max-h-56 overflow-auto">
                {opsLoading ? <p className="text-sm text-gray-400">Loading trainers...</p> : trainersLive.map((t) => <div key={t._id} className="rounded-lg bg-white/5 p-2 text-sm">{`${t.userId?.firstName || ''} ${t.userId?.lastName || ''}`.trim() || 'Trainer'} • ${t.hourlyRate || 0}/hr</div>)}
                {!opsLoading && trainersLive.length === 0 && <p className="text-sm text-gray-400">No trainers yet.</p>}
              </div>
            </div>
          </div>

          {(opsError || opsSuccess) && (
            <div className={`mt-4 rounded-lg px-3 py-2 text-sm ${opsError ? 'bg-red-500/15 text-red-200 border border-red-500/30' : 'bg-emerald-500/15 text-emerald-200 border border-emerald-500/30'}`}>
              {opsError || opsSuccess}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GymOwnerDashboard;
