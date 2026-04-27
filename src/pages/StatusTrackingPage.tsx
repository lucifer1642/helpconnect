import React, { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { RefreshCw, AlertCircle, CheckCircle, Clock, XCircle, ChevronDown, ChevronUp, Droplet, Heart, Activity, Search, MapPin, Hospital, Phone, Trash2 } from 'lucide-react';
import { useGetDonorRequests, useRefreshRequests, useCancelRequest, useDiscardRequest, BloodRequest } from '../hooks/useRequests';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { useRealtimeSubscription } from '../hooks/useRealtimeSubscription';
import { toast } from 'sonner';

export default function StatusTrackingPage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id);
    });
  }, []);

  useRealtimeSubscription({ userId, enabled: !!userId });

  const { data: requests, isLoading, isError, error, refetch, isFetching } = useGetDonorRequests();
  const discardRequest = useDiscardRequest();

  const handleDiscardRequest = async (requestId: string) => {
    toast.custom((t) => (
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-[32px] border border-white/20 shadow-2xl backdrop-blur-xl">
        <p className="font-black text-lg mb-4">Discard this request?</p>
        <div className="flex gap-3">
          <button 
            onClick={async () => {
              await discardRequest.mutateAsync(requestId);
              toast.dismiss(t);
            }}
            className="flex-1 h-12 bg-rose-500 text-white rounded-2xl font-black text-sm"
          >
            Discard
          </button>
          <button 
            onClick={() => toast.dismiss(t)}
            className="flex-1 h-12 bg-muted rounded-2xl font-black text-sm"
          >
            Keep
          </button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  if (isLoading) {
    return (
        <div className="flex h-screen items-center justify-center bg-background">
            <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} className="flex flex-col items-center gap-4">
                <Activity className="w-12 h-12 text-primary" />
                <p className="text-xs font-black tracking-widest uppercase text-muted-foreground">Tracking Live Requests...</p>
            </motion.div>
        </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-start overflow-hidden bg-background pt-24 pb-20 px-4">
      
      {/* --- BACKGROUND DECOR --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-[10%] w-[400px] h-[400px] bg-primary/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-[10%] w-[400px] h-[400px] bg-rose-500/5 blur-[120px] rounded-full animate-pulse" />
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-10">
          <div className="text-center md:text-left">
            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-black tracking-tighter"
            >
                My <span className="text-primary italic">Requests</span>
            </motion.h1>
            <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-muted-foreground font-medium mt-1 text-sm"
            >
                Monitoring {requests?.length || 0} active emergency broadcasts
            </motion.p>
          </div>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => refetch()}
            className="flex items-center gap-3 bg-white/40 dark:bg-white/5 backdrop-blur-xl px-6 py-4 rounded-[24px] border border-white/20 shadow-xl font-black tracking-widest text-[10px] uppercase group"
          >
            <RefreshCw className={`w-4 h-4 group-hover:rotate-180 transition-transform duration-500 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </motion.button>
        </div>

        {/* --- TIMELINE LIST --- */}
        {!requests || requests.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-white/20 dark:bg-white/5 rounded-[40px] border border-dashed border-border"
          >
            <Droplet className="w-20 h-20 text-muted-foreground mx-auto mb-6 opacity-20" />
            <h3 className="text-2xl font-black mb-2">No Active Requests</h3>
            <p className="text-muted-foreground font-medium mb-8">You haven't broadcasted any emergency requests yet.</p>
            <button 
                onClick={() => navigate({ to: '/request-blood' })}
                className="h-14 px-8 bg-primary text-white rounded-2xl font-black shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
            >
                Broadcast New Request
            </button>
          </motion.div>
        ) : (
          <div className="relative space-y-12">
            {/* Timeline Line */}
            <div className="absolute left-[40px] top-4 bottom-4 w-1 bg-gradient-to-b from-primary via-rose-500/50 to-transparent rounded-full hidden md:block" />

            <AnimatePresence mode="popLayout">
              {requests.map((request, index) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative pl-0 md:pl-24"
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-[30px] top-[40px] w-6 h-6 rounded-full bg-background border-4 border-primary z-10 hidden md:block" />
                  
                  <TrackingCard 
                    request={request} 
                    onDiscard={handleDiscardRequest} 
                    isDiscardPending={discardRequest.isPending} 
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Real-time Indicator */}
      {isFetching && (
        <motion.div 
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            className="fixed bottom-10 right-10 bg-primary text-white px-6 py-3 rounded-full font-black text-xs tracking-widest uppercase flex items-center gap-3 shadow-2xl z-50"
        >
            <RefreshCw className="w-4 h-4 animate-spin" /> Live Syncing
        </motion.div>
      )}
    </div>
  );
}

function TrackingCard({ request, onDiscard, isDiscardPending }: { request: BloodRequest, onDiscard: (id: string) => void, isDiscardPending: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusMap: any = {
    pending: { label: 'PENDING', color: 'text-yellow-500', bg: 'bg-yellow-500/10', icon: <Clock /> },
    searching: { label: 'SEARCHING', color: 'text-blue-500', bg: 'bg-blue-500/10', icon: <RefreshCw className="animate-spin" /> },
    matched: { label: 'MATCHED', color: 'text-green-500', bg: 'bg-green-500/10', icon: <CheckCircle /> },
    fulfilled: { label: 'FULFILLED', color: 'text-green-500', bg: 'bg-green-500/10', icon: <CheckCircle /> },
    cancelled: { label: 'CANCELLED', color: 'text-rose-500', bg: 'bg-rose-500/10', icon: <XCircle /> },
    discarded: { label: 'DISCARDED', color: 'text-muted-foreground', bg: 'bg-muted/10', icon: <XCircle /> },
  };

  const st = statusMap[request.status] || statusMap.pending;

  return (
    <div className="bg-white/70 dark:bg-black/40 backdrop-blur-[40px] rounded-[32px] border border-white/20 dark:border-white/5 shadow-2xl group overflow-hidden">
        <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-[20px] flex items-center justify-center border border-primary/20 shadow-inner group-hover:scale-110 transition-transform duration-500">
                        <span className="text-2xl font-black text-primary">{request.blood_type}</span>
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-xl font-black tracking-tight">{request.recipient_name}</h3>
                            <div className={`${st.bg} ${st.color} px-4 py-1.5 rounded-full font-black text-[10px] tracking-widest uppercase flex items-center gap-2`}>
                                {React.cloneElement(st.icon as React.ReactElement, { className: 'w-3 h-3' })}
                                {st.label}
                            </div>
                        </div>
                        <p className="text-muted-foreground font-medium flex items-center gap-2">
                            <Clock className="w-4 h-4" /> {new Date(request.created_at).toLocaleDateString()} • {request.units_needed} Unit(s)
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    {request.status !== 'discarded' && (
                        <Button 
                            onClick={() => onDiscard(request.id)}
                            disabled={isDiscardPending}
                            variant="outline"
                            className="flex-1 md:w-40 h-14 rounded-2xl border-white/20 font-black hover:bg-rose-500/10 hover:text-rose-500 gap-2"
                        >
                            <Trash2 className="w-4 h-4" /> Discard
                        </Button>
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
                                    <Hospital className="w-4 h-4" />
                                    <span>Hospital: <span className="text-foreground font-bold">{request.hospital_name}</span></span>
                                </div>
                                <div className="flex items-center gap-3 text-muted-foreground font-medium">
                                    <MapPin className="w-4 h-4" />
                                    <span>Address: <span className="text-foreground font-bold text-sm leading-tight">{request.hospital_address}</span></span>
                                </div>
                                <div className="flex items-center gap-3 text-muted-foreground font-medium">
                                    <Phone className="w-4 h-4" />
                                    <span>Contact: <span className="text-foreground font-bold">{request.recipient_phone}</span></span>
                                </div>
                            </div>
                            <div className="md:col-span-2 bg-white/40 dark:bg-white/5 p-8 rounded-[28px] border border-white/10">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Reason for Broadcast</p>
                                <p className="text-xl font-medium italic leading-relaxed text-foreground/90">"{request.reason}"</p>
                                
                                <div className="mt-8 p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white dark:bg-white/5 rounded-xl flex items-center justify-center text-primary shadow-sm">
                                        <Activity className="w-5 h-5" />
                                    </div>
                                    <p className="text-xs font-bold text-primary tracking-wide">MATCHING ENGINE ACTIVE: COMPATIBLE DONORS NOTIFIED</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    </div>
  );
}

function Button({ className, children, ...props }: any) {
    return (
        <button 
            className={`flex items-center justify-center transition-all active:scale-[0.98] disabled:opacity-50 ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
