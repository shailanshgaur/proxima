import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Car, Plus, MapPin, Clock, IndianRupee, X } from 'lucide-react';
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
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-display font-black text-proxima-text flex items-center gap-2">
            <Car className="w-6 h-6 text-proxima-secondary" />
            Society Carpools
          </h1>
          <p className="text-sm text-proxima-muted mt-1">Zero-pollution commutes. Secure local carpooling with neighbours.</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-proxima-secondary hover:bg-proxima-secondary/80 text-white text-sm font-semibold rounded-xl transition-all">
          <Plus className="w-4 h-4" /> Offer a Ride
        </button>
      </div>

      <div className="flex gap-1 bg-proxima-card border border-proxima-border rounded-xl p-1 w-fit">
        {([['find', 'Find a Ride'], ['mine', `Offered By Me (${myRides.length})`]] as const).map(([v, l]) => (
          <button key={v} onClick={() => setActiveView(v)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${activeView === v ? 'bg-proxima-active text-proxima-secondary' : 'text-proxima-muted hover:text-proxima-text'}`}>
            {l}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2].map(i => <div key={i} className="bg-proxima-card border border-proxima-border rounded-xl h-40 animate-pulse" />)}
        </div>
      ) : displayRides.length === 0 ? (
        <div className="text-center py-16 text-proxima-muted">
          <Car className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">{activeView === 'find' ? 'No rides available. Check back soon!' : "You haven't offered any rides yet."}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayRides.map((ride, i) => (
            <motion.div key={ride.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-proxima-card border border-proxima-border rounded-xl p-4 space-y-3 hover:border-proxima-secondary/30 transition-all">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-sm text-proxima-text">
                  <MapPin className="w-3.5 h-3.5 text-proxima-success shrink-0" />
                  <span className="font-medium truncate">{ride.origin}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-proxima-text">
                  <MapPin className="w-3.5 h-3.5 text-proxima-error shrink-0" />
                  <span className="font-medium truncate">{ride.destination}</span>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <span className="flex items-center gap-1 text-[11px] bg-proxima-active border border-proxima-border text-proxima-muted px-2 py-1 rounded-lg">
                  <Clock className="w-3 h-3" />
                  {new Date(`${ride.departure_date}T${ride.departure_time}`).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="flex items-center gap-1 text-[11px] bg-proxima-active border border-proxima-border text-proxima-muted px-2 py-1 rounded-lg">
                  <IndianRupee className="w-3 h-3" />₹{ride.fuel_split} fuel split
                </span>
                <span className="flex items-center gap-1 text-[11px] bg-proxima-active border border-proxima-border text-proxima-muted px-2 py-1 rounded-lg">
                  <Car className="w-3 h-3" />{ride.seats_available} seats
                </span>
                {ride.no_smoking && <span className="text-[11px] bg-proxima-error/10 border border-proxima-error/20 text-proxima-error px-2 py-1 rounded-lg">NO SMOKING</span>}
              </div>
              {ride.vehicle_model && <p className="text-xs text-proxima-muted">{ride.vehicle_model}</p>}
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={e => e.target === e.currentTarget && setShowForm(false)}>
            <motion.div initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 16 }}
              className="bg-proxima-card border border-proxima-border rounded-2xl p-6 w-full max-w-md space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-display font-bold text-proxima-text">Offer a Ride</h2>
                <button onClick={() => setShowForm(false)} className="text-proxima-muted hover:text-proxima-text"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input required value={form.origin} onChange={e => setForm(f => ({ ...f, origin: e.target.value }))} placeholder="Pickup: e.g. Lotus Zing, Sec 168"
                  className="w-full px-3 py-2.5 bg-proxima-base border border-proxima-border rounded-xl text-sm text-proxima-text placeholder:text-proxima-muted outline-none focus:border-proxima-secondary/50" />
                <input required value={form.destination} onChange={e => setForm(f => ({ ...f, destination: e.target.value }))} placeholder="Drop: e.g. Cyber City, Gurugram"
                  className="w-full px-3 py-2.5 bg-proxima-base border border-proxima-border rounded-xl text-sm text-proxima-text placeholder:text-proxima-muted outline-none focus:border-proxima-secondary/50" />
                <div className="grid grid-cols-2 gap-3">
                  <input required type="date" value={form.departure_date} onChange={e => setForm(f => ({ ...f, departure_date: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-proxima-base border border-proxima-border rounded-xl text-sm text-proxima-text outline-none focus:border-proxima-secondary/50" />
                  <input required type="time" value={form.departure_time} onChange={e => setForm(f => ({ ...f, departure_time: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-proxima-base border border-proxima-border rounded-xl text-sm text-proxima-text outline-none focus:border-proxima-secondary/50" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input value={form.seats_available} onChange={e => setForm(f => ({ ...f, seats_available: e.target.value }))} placeholder="Seats" type="number" min="1" max="6"
                    className="w-full px-3 py-2.5 bg-proxima-base border border-proxima-border rounded-xl text-sm text-proxima-text placeholder:text-proxima-muted outline-none focus:border-proxima-secondary/50" />
                  <input value={form.fuel_split} onChange={e => setForm(f => ({ ...f, fuel_split: e.target.value }))} placeholder="₹ fuel split" type="number" min="0"
                    className="w-full px-3 py-2.5 bg-proxima-base border border-proxima-border rounded-xl text-sm text-proxima-text placeholder:text-proxima-muted outline-none focus:border-proxima-secondary/50" />
                </div>
                <input value={form.vehicle_model} onChange={e => setForm(f => ({ ...f, vehicle_model: e.target.value }))} placeholder="Vehicle (optional)"
                  className="w-full px-3 py-2.5 bg-proxima-base border border-proxima-border rounded-xl text-sm text-proxima-text placeholder:text-proxima-muted outline-none focus:border-proxima-secondary/50" />
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-xs text-proxima-muted cursor-pointer">
                    <input type="checkbox" checked={form.no_smoking} onChange={e => setForm(f => ({ ...f, no_smoking: e.target.checked }))} className="accent-proxima-primary" />
                    No smoking
                  </label>
                  <label className="flex items-center gap-2 text-xs text-proxima-muted cursor-pointer">
                    <input type="checkbox" checked={form.ev_only} onChange={e => setForm(f => ({ ...f, ev_only: e.target.checked }))} className="accent-proxima-primary" />
                    EV only
                  </label>
                </div>
                <button type="submit" disabled={submitting}
                  className="w-full py-2.5 bg-proxima-secondary hover:bg-proxima-secondary/80 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-50">
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
