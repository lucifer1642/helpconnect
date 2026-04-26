import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { supabase } from '../lib/supabase';
import { useGetMyDonorProfile, useUpdateDonorProfile } from '../hooks/useDonors';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { AlertCircle, Heart, ShieldCheck, Activity, Droplet, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DonorRegistrationPage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string>('');
  const { data: currentDonor } = useGetMyDonorProfile();
  const updateProfileMutation = useUpdateDonorProfile();

  const [name, setName] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [phone, setPhone] = useState('');
  const [isEligible, setIsEligible] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) setUserId(user.id);
    });
  }, []);

  useEffect(() => {
    if (currentDonor) {
      setName(currentDonor.name || '');
      setBloodGroup(currentDonor.blood_type || '');
      setCity(currentDonor.location_city || '');
      setState(currentDonor.state || '');
      setPhone(currentDonor.contact_phone || '');
    }
  }, [currentDonor]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return toast.error('Please log in first');
    if (!isEligible) return toast.error('Please confirm eligibility requirements');

    try {
      await updateProfileMutation.mutateAsync({
        name: name.trim(),
        blood_type: bloodGroup,
        location_city: city.trim(),
        state: state.trim(),
        contact_phone: phone.trim(),
        is_available: true,
      });
      toast.success('Registration successful!');
      navigate({ to: '/donor-dashboard' });
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-start overflow-hidden bg-background pt-24 pb-20 px-4">
      
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-rose-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        <div className="text-center mb-12">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-primary/10 w-20 h-20 rounded-[32px] flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-primary fill-current" />
            </motion.div>
            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-7xl font-black tracking-tighter mb-4"
            >
                Join the <span className="text-primary italic">LifeLine</span>
            </motion.h1>
            <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-muted-foreground text-lg font-medium max-w-2xl mx-auto"
            >
                Your registration ensures that our network can find you during critical emergencies in your city.
            </motion.p>
        </div>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/70 dark:bg-black/40 backdrop-blur-[50px] rounded-[40px] border border-white/20 dark:border-white/5 shadow-2xl p-8 md:p-12"
        >
            <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <Label className="text-xs font-black uppercase tracking-widest ml-1">Full Name</Label>
                        <Input value={name} onChange={e => setName(e.target.value)} className="h-14 rounded-2xl bg-white/50 dark:bg-black/20 border-white/20" placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-black uppercase tracking-widest ml-1">Blood Type</Label>
                        <Select value={bloodGroup} onValueChange={setBloodGroup}>
                            <SelectTrigger className="h-14 rounded-2xl bg-white/50 dark:bg-black/20 border-white/20">
                                <SelectValue placeholder="Select Type" />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl">
                                {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="space-y-2">
                        <Label className="text-xs font-black uppercase tracking-widest ml-1">Phone</Label>
                        <Input value={phone} onChange={e => setPhone(e.target.value)} className="h-14 rounded-2xl bg-white/50 dark:bg-black/20 border-white/20" placeholder="+91 00000 00000" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-black uppercase tracking-widest ml-1">City</Label>
                        <Input value={city} onChange={e => setCity(e.target.value)} className="h-14 rounded-2xl bg-white/50 dark:bg-black/20 border-white/20" placeholder="Mumbai" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-black uppercase tracking-widest ml-1">State</Label>
                        <Input value={state} onChange={e => setState(e.target.value)} className="h-14 rounded-2xl bg-white/50 dark:bg-black/20 border-white/20" placeholder="Maharashtra" />
                    </div>
                </div>

                <div className="p-8 bg-primary/5 rounded-[32px] border border-primary/10 space-y-6">
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="w-6 h-6 text-primary" />
                        <h3 className="font-black text-sm tracking-widest uppercase">Health Verification</h3>
                    </div>
                    
                    <div className="flex items-start gap-4 p-4 bg-white/50 dark:bg-black/20 rounded-2xl border border-white/20">
                        <Checkbox 
                            id="eligible" 
                            checked={isEligible} 
                            onCheckedChange={c => setIsEligible(c as boolean)}
                            className="mt-1"
                        />
                        <Label htmlFor="eligible" className="text-sm font-medium leading-relaxed cursor-pointer">
                            I confirm that I am in good health, weigh at least 45kg, and have not undergone major surgery or had a tattoo in the last 6 months.
                        </Label>
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button type="button" variant="ghost" onClick={() => navigate({ to: '/' })} className="flex-1 h-16 rounded-2xl font-black">Cancel</Button>
                    <Button type="submit" disabled={updateProfileMutation.isPending} className="flex-[2] h-16 rounded-2xl font-black text-lg shadow-xl shadow-primary/20">
                        {updateProfileMutation.isPending ? 'Syncing...' : 'Confirm Registration'}
                    </Button>
                </div>
            </form>
        </motion.div>

        <p className="mt-10 text-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-30">
          Secure Medical-Grade Enrollment 🇮🇳
        </p>
      </div>
    </div>
  );
}
