import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCreateBloodRequest } from '../hooks/useRequests';
import { AlertCircle, CheckCircle, Loader2, Droplet, Heart, Activity, User, Phone, MapPin, Hospital, FileText, ChevronRight, ChevronLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RequestFormData {
  recipient_name: string;
  recipient_phone: string;
  blood_type: string;
  units_needed: number;
  urgency: 'critical' | 'high' | 'medium' | 'low';
  hospital_name: string;
  hospital_address: string;
  state: string;
  reason: string;
}

export default function RequestBloodPage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string>('');
  const createRequest = useCreateBloodRequest();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id);
    });
  }, []);

  const [formData, setFormData] = useState<RequestFormData>({
    recipient_name: '',
    recipient_phone: '',
    blood_type: 'O+',
    units_needed: 1,
    urgency: 'medium',
    hospital_name: '',
    hospital_address: '',
    state: '',
    reason: '',
  });

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Partial<Record<keyof RequestFormData, string>>>({});

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Partial<Record<keyof RequestFormData, string>> = {};
    if (currentStep === 1) {
      if (!formData.recipient_name.trim()) newErrors.recipient_name = 'Required';
      if (!formData.recipient_phone.trim()) newErrors.recipient_phone = 'Required';
    } else if (currentStep === 2) {
      if (!formData.hospital_name.trim()) newErrors.hospital_name = 'Required';
      if (!formData.hospital_address.trim()) newErrors.hospital_address = 'Required';
      if (!formData.state.trim()) newErrors.state = 'Required';
    } else if (currentStep === 3) {
      if (!formData.reason.trim()) newErrors.reason = 'Required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'units_needed' ? parseInt(value) || 1 : value,
    }));
    if (errors[name as keyof RequestFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) return;
    if (!userId) return toast.error('Please log in first');

    try {
      await createRequest.mutateAsync({ ...formData });
      toast.success('Request broadcasted successfully!');
      setTimeout(() => {
        navigate({ to: '/status-tracking' });
      }, 1500);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to create request');
    }
  };

  const nextStep = () => {
    if (validateStep(step)) setStep(prev => prev + 1);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-start overflow-hidden bg-background pt-24 pb-20 px-4">
      
      {/* --- PREMIUM PARALLAX BACKGROUND --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div style={{ y: y1 }} className="absolute top-20 right-[10%] opacity-10">
          <Droplet className="w-64 h-64 text-primary" />
        </motion.div>
        <motion.div style={{ y: y2 }} className="absolute bottom-40 left-[5%] opacity-10">
          <Heart className="w-48 h-48 text-rose-500" />
        </motion.div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-3xl">
        {/* --- TEXT REVEAL HEADER --- */}
        <div className="text-center mb-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black tracking-tighter mb-3"
          >
            Broadcast <span className="text-primary italic">Request</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground font-medium max-w-xl mx-auto text-sm"
          >
            Your request will be sent instantly to all compatible donors in your area via our real-time network.
          </motion.p>
        </div>

        {/* --- STEP INDICATOR --- */}
        <div className="flex justify-center gap-3 sm:gap-4 mb-10 px-2 sm:px-0">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 sm:gap-2">
              <motion.div 
                animate={{ 
                  scale: step === i ? 1.15 : 1,
                  backgroundColor: step >= i ? 'var(--primary)' : 'rgba(var(--primary-rgb), 0.1)',
                  color: step >= i ? '#fff' : 'currentColor'
                }}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-black shadow-lg text-sm sm:text-base"
              >
                {step > i ? <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" /> : i}
              </motion.div>
              <span className={`text-[8px] sm:text-[10px] font-black uppercase tracking-widest ${step >= i ? 'text-primary' : 'text-muted-foreground'}`}>
                {i === 1 ? 'Patient' : i === 2 ? 'Location' : 'Confirm'}
              </span>
            </div>
          ))}
        </div>

        {/* --- MAIN GLASS FORM --- */}
        <motion.div
          layout
          className="bg-white/70 dark:bg-black/40 backdrop-blur-[50px] rounded-[40px] border border-white/20 dark:border-white/5 shadow-2xl shadow-primary/5 p-8 md:p-12"
        >
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-widest ml-1">Patient Name</Label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary" />
                        <Input 
                          name="recipient_name" 
                          value={formData.recipient_name} 
                          onChange={handleChange} 
                          className="h-14 pl-12 rounded-2xl bg-white/50 dark:bg-black/20 border-white/20" 
                          placeholder="John Doe"
                        />
                      </div>
                      {errors.recipient_name && <p className="text-xs font-bold text-primary ml-1">Required</p>}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-widest ml-1">Contact Phone</Label>
                      <div className="relative group">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary" />
                        <Input 
                          name="recipient_phone" 
                          value={formData.recipient_phone} 
                          onChange={handleChange} 
                          className="h-14 pl-12 rounded-2xl bg-white/50 dark:bg-black/20 border-white/20" 
                          placeholder="+91 00000 00000"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-widest ml-1">Blood Type</Label>
                      <select name="blood_type" value={formData.blood_type} onChange={handleChange} className="w-full h-14 px-4 rounded-2xl bg-white/50 dark:bg-black/20 border-white/20 font-black focus:ring-2 focus:ring-primary outline-none">
                        {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-widest ml-1">Units Needed</Label>
                      <Input type="number" name="units_needed" value={formData.units_needed} onChange={handleChange} className="h-14 rounded-2xl bg-white/50 dark:bg-black/20 border-white/20" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-widest ml-1">Urgency</Label>
                      <select name="urgency" value={formData.urgency} onChange={handleChange} className="w-full h-14 px-4 rounded-2xl bg-white/50 dark:bg-black/20 border-white/20 font-black focus:ring-2 focus:ring-primary outline-none">
                        <option value="critical">Critical 🚨</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                  </div>
                  
                  <Button type="button" onClick={nextStep} className="w-full h-14 rounded-2xl font-black text-lg">
                    Continue to Location <ChevronRight className="ml-2 w-5 h-5" />
                  </Button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest ml-1">Hospital Name</Label>
                    <div className="relative group">
                      <Hospital className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary" />
                      <Input name="hospital_name" value={formData.hospital_name} onChange={handleChange} className="h-14 pl-12 rounded-2xl bg-white/50 dark:bg-black/20 border-white/20" placeholder="City General Hospital" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest ml-1">Hospital Address</Label>
                    <div className="relative group">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary" />
                      <Input name="hospital_address" value={formData.hospital_address} onChange={handleChange} className="h-14 pl-12 rounded-2xl bg-white/50 dark:bg-black/20 border-white/20" placeholder="123 Main St, Punjab" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest ml-1">State</Label>
                    <Input name="state" value={formData.state} onChange={handleChange} className="h-14 rounded-2xl bg-white/50 dark:bg-black/20 border-white/20" placeholder="Punjab" />
                  </div>
                  <div className="flex gap-4">
                    <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1 h-14 rounded-2xl font-black">
                      <ChevronLeft className="mr-2 w-5 h-5" /> Back
                    </Button>
                    <Button type="button" onClick={nextStep} className="flex-[2] h-14 rounded-2xl font-black text-lg">
                      Final Step <ChevronRight className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest ml-1">Reason for Request</Label>
                    <div className="relative group">
                      <FileText className="absolute left-4 top-6 w-4 h-4 text-muted-foreground group-focus-within:text-primary" />
                      <textarea 
                        name="reason" 
                        value={formData.reason} 
                        onChange={handleChange} 
                        rows={5}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/50 dark:bg-black/20 border-white/20 font-medium focus:ring-2 focus:ring-primary outline-none transition-all"
                        placeholder="Please describe the emergency..."
                      />
                    </div>
                  </div>
                  
                  <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10">
                    <p className="text-sm font-bold text-primary flex items-center gap-2">
                      <Activity className="w-4 h-4" /> Ready for Broadcast
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 font-medium">
                      By submitting, you are requesting blood for {formData.recipient_name} at {formData.hospital_name}. All matching donors in your state will be notified immediately.
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1 h-14 rounded-2xl font-black">
                      <ChevronLeft className="mr-2 w-5 h-5" /> Back
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createRequest.isPending} 
                      className="flex-[2] h-14 rounded-2xl font-black text-lg shadow-xl shadow-primary/20"
                    >
                      {createRequest.isPending ? <Loader2 className="animate-spin w-6 h-6" /> : "Broadcast Request"}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>

        <p className="mt-10 text-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-30">
          Emergency Blood Coordination Network 🇮🇳
        </p>
      </div>
    </div>
  );
}
