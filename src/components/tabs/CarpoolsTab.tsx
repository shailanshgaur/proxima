import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ResidentProfile, Ride } from '../../types';
import { rideService } from '../../lib/rideService';

interface CarpoolsTabProps { profile: ResidentProfile; }

export const CarpoolsTab: React.FC<CarpoolsTabProps> = ({ profile }) => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [myRides, setMyRides] = useState<Ride[]>([]);
  const [activeView, setActiveView] = useState<'find' | 'mine'>('find');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    origin: '', destination: '', departure_date: '', departure_time: '',
    seats_available: '2', fuel_split: '100', vehicle_model: '',
    no_smoking: false, ev_only: false,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      rideService.getRides(profile.society_id),
      rideService.getMyRides(profile.user_id),
    ]).then(([all, mine]) => {
      setRides(all);
      setMyRides(mine);
    }).catch(console.error).finally(() => setLoading(false));
  }, [profile.society_id, profile.user_id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (profile.is_demo || !profile.society_id) return;
    setSubmitting(true);
    try {
      const newRide = await rideService.createRide({
        driver_id: profile.user_id,
        society_id: profile.society_id,
        origin: form.origin.trim(),
        destination: form.destination.trim(),
        departure_date: form.departure_date,
        departure_time: form.departure_time,
        seats_available: parseInt(form.seats_available),
        fuel_split: parseInt(form.fuel_split),
        vehicle_model: form.vehicle_model.trim() || undefined,
        no_smoking: form.no_smoking,
        ev_only: form.ev_only,
      });
      setRides(prev => [newRide, ...prev]);
      setMyRides(prev => [newRide, ...prev]);
      setShowForm(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const displayRides = activeView === 'find' ? rides : myRides;

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-display font-black text-proxima-text">
            Society Carpools
          </h1>
          <p className="text-sm text-proxima-muted mt-1">
            Zero-pollution commutes. Share rides with neighbours for a greener society.
          </p>
        </div>
        <button
          onClick={() => !profile.is_demo && profile.society_id && setShowForm(true)}
          disabled={profile.is_demo || !profile.society_id}
          className="px-4 py-2 bg-proxima-secondary hover:brightness-110 text-proxima-base text-sm font-semibold rounded-xl transition-all glow-blue-active disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {profile.is_demo ? 'Preview only' : profile.society_id ? '+ Offer a Ride' : 'Society setup pending'}
        </button>
      </div>

      {/* Sub-tab toggle */}
      <div className="flex gap-1 bg-proxima-card border border-proxima-border rounded-xl p-1 w-fit">
        {([['find', 'Find a Ride'], ['mine', `Offered By Me (${myRides.length})`]] as const).map(([v, l]) => (
          <button
            key={v}
            onClick={() => setActiveView(v)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeView === v
                ? 'bg-proxima-active text-proxima-secondary'
                : 'text-proxima-muted hover:text-proxima-text'
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Ride list */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map(i => (
            <div key={i} className="bg-proxima-card border border-proxima-border rounded-2xl h-48 animate-pulse" />
          ))}
        </div>
      ) : displayRides.length === 0 ? (
        <div className="text-center py-16 text-proxima-muted">
          <p className="text-sm">
            {activeView === 'find'
              ? 'No rides available. Check back soon!'
              : "You haven't offered any rides yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayRides.map((ride, i) => (
            <RideCard key={ride.id} ride={ride} index={i} currentUserId={profile.user_id} />
          ))}
        </div>
      )}

      {/* Create Ride Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={e => e.target === e.currentTarget && setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 16 }}
              className="bg-proxima-card border border-proxima-border rounded-2xl p-6 w-full max-w-md space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-display font-bold text-proxima-text">Offer a Ride</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-proxima-muted hover:text-proxima-text text-xl leading-none"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs text-proxima-muted mb-1">Pickup point</label>
                  <input
                    required
                    value={form.origin}
                    onChange={e => setForm(f => ({ ...f, origin: e.target.value }))}
                    placeholder="e.g. Lotus Zing, Sec 168"
                    className="w-full px-3 py-2.5 bg-proxima-base border border-proxima-border rounded-xl text-sm text-white placeholder:text-proxima-muted outline-none focus:border-proxima-secondary/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs text-proxima-muted mb-1">Drop point</label>
                  <input
                    required
                    value={form.destination}
                    onChange={e => setForm(f => ({ ...f, destination: e.target.value }))}
                    placeholder="e.g. Cyber City, Gurugram"
                    className="w-full px-3 py-2.5 bg-proxima-base border border-proxima-border rounded-xl text-sm text-white placeholder:text-proxima-muted outline-none focus:border-proxima-secondary/50 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-proxima-muted mb-1">Date</label>
                    <input
                      required
                      type="date"
                      value={form.departure_date}
                      onChange={e => setForm(f => ({ ...f, departure_date: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-proxima-base border border-proxima-border rounded-xl text-sm text-white outline-none focus:border-proxima-secondary/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-proxima-muted mb-1">Time</label>
                    <input
                      required
                      type="time"
                      value={form.departure_time}
                      onChange={e => setForm(f => ({ ...f, departure_time: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-proxima-base border border-proxima-border rounded-xl text-sm text-white outline-none focus:border-proxima-secondary/50 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-proxima-muted mb-1">Seats available</label>
                    <input
                      value={form.seats_available}
                      onChange={e => setForm(f => ({ ...f, seats_available: e.target.value }))}
                      placeholder="2"
                      type="number"
                      min="1"
                      max="6"
                      className="w-full px-3 py-2.5 bg-proxima-base border border-proxima-border rounded-xl text-sm text-white placeholder:text-proxima-muted outline-none focus:border-proxima-secondary/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-proxima-muted mb-1">Fuel split (₹)</label>
                    <input
                      value={form.fuel_split}
                      onChange={e => setForm(f => ({ ...f, fuel_split: e.target.value }))}
                      placeholder="100"
                      type="number"
                      min="0"
                      className="w-full px-3 py-2.5 bg-proxima-base border border-proxima-border rounded-xl text-sm text-white placeholder:text-proxima-muted outline-none focus:border-proxima-secondary/50 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-proxima-muted mb-1">Vehicle (optional)</label>
                  <input
                    value={form.vehicle_model}
                    onChange={e => setForm(f => ({ ...f, vehicle_model: e.target.value }))}
                    placeholder="e.g. Maruti Swift, white"
                    className="w-full px-3 py-2.5 bg-proxima-base border border-proxima-border rounded-xl text-sm text-white placeholder:text-proxima-muted outline-none focus:border-proxima-secondary/50 transition-colors"
                  />
                </div>

                <div className="flex gap-5 pt-1">
                  <label className="flex items-center gap-2 text-xs text-proxima-muted cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={form.no_smoking}
                      onChange={e => setForm(f => ({ ...f, no_smoking: e.target.checked }))}
                      className="accent-proxima-primary"
                    />
                    No smoking
                  </label>
                  <label className="flex items-center gap-2 text-xs text-proxima-muted cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={form.ev_only}
                      onChange={e => setForm(f => ({ ...f, ev_only: e.target.checked }))}
                      className="accent-proxima-primary"
                    />
                    EV only
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 bg-proxima-secondary hover:brightness-110 text-proxima-base text-sm font-semibold rounded-xl transition-all glow-blue-active disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Posting…' : 'Offer Ride'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── Ride Card ───────────────────────────────────────────────── */

interface RideCardProps {
  ride: Ride;
  index: number;
  currentUserId: string;
}

const RideCard: React.FC<RideCardProps> = ({ ride, index, currentUserId }) => {
  const driverInitial = ride.driver_id
    ? ride.driver_id.charAt(0).toUpperCase()
    : 'D';

  const isOwnRide = ride.driver_id === currentUserId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-proxima-card border border-proxima-border rounded-2xl p-4 space-y-3 hover:border-proxima-secondary/30 transition-all"
    >
      {/* Route with dotted connector */}
      <div className="flex items-stretch gap-3">
        {/* Dot + line column */}
        <div className="flex flex-col items-center pt-1 gap-0">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 flex-shrink-0" />
          <span className="flex-1 border-l-2 border-dashed border-proxima-border my-1" style={{ minHeight: 20 }} />
          <span className="w-2.5 h-2.5 rounded-full bg-proxima-secondary flex-shrink-0" />
        </div>
        {/* Text column */}
        <div className="flex flex-col justify-between gap-1 flex-1 min-w-0">
          <p className="text-sm font-semibold text-proxima-text truncate">{ride.origin}</p>
          <p className="text-sm font-medium text-proxima-muted truncate">{ride.destination}</p>
        </div>
        {/* Seat badge */}
        <div className="flex-shrink-0 self-start">
          <span className="text-[11px] font-semibold bg-proxima-secondary/10 border border-proxima-secondary/30 text-proxima-secondary px-2.5 py-1 rounded-lg">
            {ride.seats_available} Seats
          </span>
        </div>
      </div>

      {/* Date + driver row */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-proxima-muted bg-proxima-active border border-proxima-border px-2 py-1 rounded-lg">
          {ride.departure_date}
        </span>
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${isOwnRide ? 'bg-proxima-secondary/20 text-proxima-secondary border border-proxima-secondary/30' : 'bg-proxima-active text-proxima-muted border border-proxima-border'}`}>
            {driverInitial}
          </div>
          <span className="text-[11px] text-proxima-muted">{ride.departure_time}</span>
        </div>
      </div>

      {/* Vehicle */}
      {ride.vehicle_model && (
        <p className="text-xs text-proxima-muted truncate">{ride.vehicle_model}</p>
      )}

      {/* Tags + fuel */}
      <div className="flex items-center gap-2 flex-wrap">
        {ride.no_smoking && (
          <span className="text-[10px] font-semibold bg-red-500/10 border border-red-500/20 text-red-400 px-2 py-0.5 rounded-md tracking-wide">
            NO SMOKING
          </span>
        )}
        {ride.ev_only && (
          <span className="text-[10px] font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-md tracking-wide">
            EV
          </span>
        )}
        <span className="ml-auto text-[11px] text-proxima-muted">
          ₹{ride.fuel_split} fuel split
        </span>
      </div>
    </motion.div>
  );
};
