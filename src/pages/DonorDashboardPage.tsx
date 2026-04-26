import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { supabase } from '../lib/supabase';
import { useGetAllOpenRequests, useRespondToRequest, useGetDonorResponse, useGetMyResponses, BloodRequest } from '../hooks/useRequests';
import { useGetMyDonorProfile, useUpdateDonorProfile } from '../hooks/useDonors';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Droplet, MapPin, Phone, Clock, Heart, AlertCircle, CheckCircle2, Info, ChevronDown, ChevronUp, Activity, Zap, ShieldCheck } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useRealtimeSubscription } from '../hooks/useRealtimeSubscription';

const BLOOD_TYPE_LABELS: Record<string, string> = {
  'O+': 'O+', 'O-': 'O-', 'A+': 'A+', 'A-': 'A-', 'B+': 'B+', 'B-': 'B-', 'AB+': 'AB+', 'AB-': 'AB-',
};

const canDonate = (donorType: string, recipientType: string): boolean => {
  return donorType.replace(/[_\s]/g, '') === recipientType.replace(/[_\s]/g, '');
};

const URGENCY_COLORS: Record<string, string> = {
  critical: 'bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30',
  high: 'bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-500/30',
  medium: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30',
  low: 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30',
};

export default function DonorDashboardPage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id);
    });
  }, []);

  const { data: allRequests, isLoading: requestsLoading } = useGetAllOpenRequests();
  const { data: currentDonor, isLoading: profileLoading } = useGetMyDonorProfile();
  const updateProfileMutation = useUpdateDonorProfile();
  const { data: myResponses } = useGetMyResponses();

  useRealtimeSubscription({
    userId,
    userBloodType: currentDonor?.blood_type,
    enabled: !!userId,
  });

  const handleAvailabilityToggle = async (checked: boolean) => {
    if (!currentDonor) return;
    try {
      await updateProfileMutation.mutateAsync({ is_available: checked });
      toast.success(`You are now ${checked ? 'Active' : 'Offline'}`);
    } catch (e) {
      console.error('Toggle error:', e);
    }
  };

  const filteredRequests = allRequests?.filter(req => {
    if (myResponses?.some(res => res.request_id === req.id && res.status === 'declined')) return false;
    if (!currentDonor) return true;
    if (currentDonor.blood_type && req.blood_type && !canDonate(currentDonor.blood_type, req.blood_type)) return false;
    if (currentDonor.state && req.state && currentDonor.state.toLowerCase() !== req.state.toLowerCase()) return false;
    return true;
  }) || [];

  if (profileLoading) {
    return (
        <div className="flex h-screen items-center justify-center bg-background">
            <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} className="flex flex-col items-center gap-4">
                <Droplet className="w-12 h-12 text-primary" />
                <p className="text-xs font-black tracking-widest uppercase text-muted-foreground">Initializing Radar...</p>
            </motion.div>
        </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-start overflow-hidden bg-background pt-24 pb-20 px-4">
      
      {/* --- RADAR BACKGROUND ANIMATION --- */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-primary/20 rounded-full"
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 8, repeat: Infinity, delay: 2 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-rose-500/20 rounded-full"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      </div>

      <div className="relative z-10 w-full max-w-5xl">
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
          <div>
            <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl md:text-5xl font-black tracking-tighter"
            >
                Donor <span className="text-primary italic">Radar</span>
            </motion.h1>
            <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-muted-foreground font-medium mt-1 text-sm"
            >
                Real-time emergency matches in <span className="text-foreground font-black">{currentDonor?.state || 'India'}</span>
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-4 bg-white/40 dark:bg-white/5 backdrop-blur-xl px-6 py-4 rounded-[32px] border border-white/20 shadow-xl"
          >
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</span>
              <span className={`text-sm font-black ${currentDonor?.is_available ? 'text-green-500' : 'text-muted-foreground'}`}>
                {currentDonor?.is_available ? 'ACTIVE & RESPONDING' : 'OFFLINE'}
              </span>
            </div>
            <Switch
                checked={currentDonor?.is_available || false}
                onCheckedChange={handleAvailabilityToggle}
                className="data-[state=checked]:bg-green-500"
            />
          </motion.div>
        </div>

        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatPill icon={<Heart className="text-rose-500" />} label="LIVES IMPACTED" value="0" delay={0.1} />
            <StatPill icon={<Droplet className="text-primary" />} label="OPEN MATCHES" value={filteredRequests.length} delay={0.2} />
            <StatPill icon={<Zap className="text-orange-500" />} label="AVG RESPONSE" value="2m" delay={0.3} />
            <StatPill icon={<ShieldCheck className="text-green-500" />} label="TRUST SCORE" value="100%" delay={0.4} />
        </div>

        {/* --- REQUESTS LIST --- */}
        <div className="space-y-6">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground whitespace-nowrap">Nearby Emergencies</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>

          {requestsLoading ? (
            <div className="grid gap-6">
                {[1, 2].map(i => <Skeleton key={i} className="h-40 rounded-[32px]" />)}
            </div>
          ) : filteredRequests.length === 0 ? (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-white/20 dark:bg-white/5 rounded-[40px] border border-dashed border-border"
            >
                <Droplet className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
                <h3 className="text-xl font-bold">Clear Skies</h3>
                <p className="text-muted-foreground">No matching emergencies found in your area right now.</p>
            </motion.div>
          ) : (
            <div className="grid gap-6">
              <AnimatePresence mode="popLayout">
                {filteredRequests.map((request, index) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    layout
                  >
                    <PremiumRequestCard request={request} donorId={userId} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatPill({ icon, label, value, delay }: { icon: any, label: string, value: any, delay: number }) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="bg-white/40 dark:bg-white/5 backdrop-blur-xl p-5 rounded-[24px] border border-white/20 shadow-lg flex items-center gap-3"
        >
            <div className="p-2.5 bg-white dark:bg-white/5 rounded-xl shadow-inner">
                {icon}
            </div>
            <div>
                <p className="text-[9px] font-black tracking-widest text-muted-foreground">{label}</p>
                <p className="text-xl font-black">{value}</p>
            </div>
        </motion.div>
    );
}

function PremiumRequestCard({ request, donorId }: { request: BloodRequest, donorId: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const respondMutation = useRespondToRequest();
  const { data: existingResponse } = useGetDonorResponse(request.id, donorId);

  const handleResponse = async (status: 'accepted' | 'declined') => {
    if (existingResponse) return toast.error(`Already responded: ${existingResponse.status}`);
    try {
      await respondMutation.mutateAsync({ requestId: request.id, status });
      toast.success(status === 'accepted' ? 'Match Confirmed! Coordination starting...' : 'Request Discarded');
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const urgencyColor = URGENCY_COLORS[request.urgency || 'medium'];

  return (
    <div className="bg-white/70 dark:bg-black/40 backdrop-blur-[40px] rounded-[40px] border border-white/20 dark:border-white/5 shadow-2xl overflow-hidden group">
        <div className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-[20px] flex items-center justify-center border border-primary/20 shadow-inner group-hover:scale-110 transition-transform duration-500">
                        <span className="text-2xl font-black text-primary">{request.blood_type}</span>
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-2xl font-black tracking-tight">{request.recipient_name}</h3>
                            <Badge className={`${urgencyColor} rounded-full font-black text-[10px] px-3`}>
                                {(request.urgency || 'medium').toUpperCase()}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground font-medium flex items-center gap-2">
                            <MapPin className="w-4 h-4" /> {request.hospital_name} • {request.units_needed} Unit(s)
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    {existingResponse ? (
                        <div className="flex-1 md:w-48 text-center p-4 bg-muted/50 rounded-2xl font-black text-xs tracking-widest uppercase opacity-50">
                            {existingResponse.status === 'accepted' ? '✓ CONFIRMED' : '✗ DISCARDED'}
                        </div>
                    ) : (
                        <>
                            <Button 
                                onClick={() => handleResponse('accepted')}
                                disabled={respondMutation.isPending}
                                className="flex-1 md:w-32 h-14 rounded-2xl bg-green-500 hover:bg-green-600 font-black shadow-lg shadow-green-500/20"
                            >
                                Accept
                            </Button>
                            <Button 
                                onClick={() => handleResponse('declined')}
                                disabled={respondMutation.isPending}
                                variant="outline"
                                className="flex-1 md:w-32 h-14 rounded-2xl border-white/20 font-black hover:bg-rose-500/10 hover:text-rose-500"
                            >
                                Discard
                            </Button>
                        </>
                    )}
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="w-14 h-14 rounded-2xl bg-white/50 dark:bg-white/5"
                    >
                        {isExpanded ? <ChevronUp /> : <ChevronDown />}
                    </Button>
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="grid md:grid-cols-3 gap-8 mt-10 pt-10 border-t border-white/10">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-muted-foreground font-medium">
                                    <Phone className="w-4 h-4" />
                                    <span>Contact: <span className="text-foreground font-bold">{request.recipient_phone}</span></span>
                                </div>
                                <div className="flex items-center gap-3 text-muted-foreground font-medium">
                                    <Hospital className="w-4 h-4" />
                                    <span>Location: <span className="text-foreground font-bold">{request.hospital_address}</span></span>
                                </div>
                            </div>
                            <div className="md:col-span-2 bg-white/40 dark:bg-white/5 p-6 rounded-[28px] border border-white/10">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Emergency Details</p>
                                <p className="text-lg font-medium italic">"{request.reason}"</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    </div>
  );
}

function Hospital({ className }: { className?: string }) {
    return <MapPin className={className} />;
}
