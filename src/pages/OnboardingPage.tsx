import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { supabase } from '../lib/supabase';
import { useGetMyDonorProfile, useUpdateDonorProfile } from '../hooks/useDonors';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { User, MapPin, Phone, Droplets, CheckCircle2 } from 'lucide-react';

export default function OnboardingPage() {
    const navigate = useNavigate();
    const { data: profile, isLoading: isProfileLoading } = useGetMyDonorProfile();
    const updateProfile = useUpdateDonorProfile();

    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [bloodType, setBloodType] = useState('');
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');

    // Redirect if profile is already complete
    useEffect(() => {
        if (!isProfileLoading && profile) {
            const isComplete = 
                profile.name && 
                profile.blood_type && 
                profile.blood_type !== 'Unknown' && 
                profile.location_city && 
                profile.contact_phone;

            if (isComplete) {
                navigate({ to: '/' });
            } else {
                // Pre-fill what we have
                setName(profile.name || '');
                setBloodType(profile.blood_type === 'Unknown' ? '' : profile.blood_type);
                setPhone(profile.contact_phone || '');
                setCity(profile.location_city || '');
                setState(profile.state || '');
            }
        }
    }, [profile, isProfileLoading, navigate]);

    const handleSave = async () => {
        if (!name || !bloodType || !phone || !city) {
            return toast.error('Please fill in all mandatory fields');
        }

        try {
            await updateProfile.mutateAsync({
                name,
                blood_type: bloodType,
                contact_phone: phone,
                location_city: city,
                state: state || 'Punjab', // Defaulting to Punjab as per user context
                is_available: true
            });
            
            toast.success('Profile completed! Welcome to HelpConnect.');
            navigate({ to: '/' });
        } catch (error) {
            console.error('Onboarding save error:', error);
        }
    };

    if (isProfileLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <motion.div 
                    animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="flex flex-col items-center gap-4"
                >
                    <Droplets className="w-12 h-12 text-primary" />
                    <p className="text-sm font-bold tracking-widest uppercase text-muted-foreground">Setting up your profile...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#fafafa] dark:bg-[#02040a] px-4 py-20">
            
            {/* Background Gradients */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-rose-500/5 blur-[120px] rounded-full" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-[500px]"
            >
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black tracking-tight mb-2">Complete Your Profile 🏥</h1>
                    <p className="text-muted-foreground font-medium">We need a few details to get you started on your journey.</p>
                </div>

                <Card className="rounded-[32px] border-white/20 dark:border-white/5 bg-white/70 dark:bg-black/40 backdrop-blur-[40px] shadow-2xl overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-rose-500 to-orange-500" />
                    
                    <CardHeader className="pt-10">
                        <div className="flex justify-center mb-4">
                            <div className="flex items-center gap-2">
                                {[1, 2].map((i) => (
                                    <div 
                                        key={i}
                                        className={`h-1.5 w-12 rounded-full transition-all duration-500 ${step >= i ? 'bg-primary' : 'bg-muted'}`}
                                    />
                                ))}
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-black text-center">
                            {step === 1 ? 'Personal Info' : 'Blood Details'}
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="px-8 pb-10">
                        <AnimatePresence mode="wait">
                            {step === 1 ? (
                                <motion.div 
                                    key="step1"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="space-y-6"
                                >
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-widest ml-1">Full Name</Label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                            <Input
                                                placeholder="Enter your name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="h-14 pl-12 rounded-2xl bg-white/50 dark:bg-black/20 border-white/20 focus:ring-primary"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-widest ml-1">Phone Number</Label>
                                        <div className="relative group">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                            <Input
                                                placeholder="+91 98765 43210"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                className="h-14 pl-12 rounded-2xl bg-white/50 dark:bg-black/20 border-white/20 focus:ring-primary"
                                            />
                                        </div>
                                    </div>
                                    <Button 
                                        className="w-full h-14 rounded-2xl font-bold text-lg"
                                        onClick={() => name && phone ? setStep(2) : toast.error('Fill in name and phone')}
                                    >
                                        Next Step
                                    </Button>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="step2"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="space-y-6"
                                >
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-widest ml-1">Blood Type</Label>
                                        <Select value={bloodType} onValueChange={setBloodType}>
                                            <SelectTrigger className="h-14 rounded-2xl bg-white/50 dark:bg-black/20 border-white/20">
                                                <SelectValue placeholder="Select Blood Type" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl">
                                                {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((type) => (
                                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-widest ml-1">City</Label>
                                        <div className="relative group">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                            <Input
                                                placeholder="e.g. Jalandhar"
                                                value={city}
                                                onChange={(e) => setCity(e.target.value)}
                                                className="h-14 pl-12 rounded-2xl bg-white/50 dark:bg-black/20 border-white/20 focus:ring-primary"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <Button variant="outline" className="flex-1 h-14 rounded-2xl" onClick={() => setStep(1)}>Back</Button>
                                        <Button 
                                            className="flex-[2] h-14 rounded-2xl font-bold text-lg"
                                            onClick={handleSave}
                                            disabled={updateProfile.isPending}
                                        >
                                            {updateProfile.isPending ? 'Saving...' : 'Finish Setup'}
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </CardContent>
                </Card>

                <p className="mt-8 text-center text-xs font-bold tracking-widest text-muted-foreground uppercase opacity-50">
                    Mandatory for Emergency Coordination 🇮🇳
                </p>
            </motion.div>
        </div>
    );
}
