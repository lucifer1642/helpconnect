import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { supabase } from '../lib/supabase';
import { useGetMyDonorProfile, useUpdateDonorProfile } from '../hooks/useDonors';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, MapPin, ShieldCheck, Heart, LogOut, ChevronRight, Activity, Droplet } from 'lucide-react';

export default function ProfilePage() {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const { data: profile, isLoading, refetch } = useGetMyDonorProfile();
    const updateProfile = useUpdateDonorProfile();

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        contact_phone: '',
        location_city: '',
        location_address: '',
        state: '',
    });

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
        });
    }, []);

    useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.name || '',
                contact_phone: profile.contact_phone || '',
                location_city: profile.location_city || '',
                location_address: profile.location_address || '',
                state: profile.state || '',
            });
        }
    }, [profile]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        toast.success('Signed out successfully');
        navigate({ to: '/' });
    };

    const handleSave = async () => {
        try {
            await updateProfile.mutateAsync(formData);
            setIsEditing(false);
            refetch();
        } catch (error) {
            console.error('Update error:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} className="flex flex-col items-center gap-4">
                    <Activity className="w-12 h-12 text-primary" />
                    <p className="text-xs font-black tracking-widest uppercase text-muted-foreground">Syncing Secure Data...</p>
                </motion.div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center space-y-6 max-w-sm">
                    <div className="bg-primary/10 w-20 h-20 rounded-[32px] flex items-center justify-center mx-auto mb-6">
                        <ShieldCheck className="w-10 h-10 text-primary" />
                    </div>
                    <h2 className="text-3xl font-black tracking-tight">Access Denied</h2>
                    <p className="text-muted-foreground font-medium">Please sign in to your secure HelpConnect vault to manage your profile.</p>
                    <Button onClick={() => navigate({ to: '/login' })} className="w-full h-14 rounded-2xl font-black">Sign In Now</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen w-full flex flex-col items-center justify-start overflow-hidden bg-background pt-24 pb-20 px-4">
            
            {/* Background Gradients */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-rose-500/5 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 w-full max-w-4xl">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <h1 className="text-4xl xs:text-5xl md:text-7xl lg:text-[clamp(2.5rem,7vw,4.5rem)] font-black tracking-tighter">My <span className="text-primary italic">Identity</span></h1>
                        <p className="text-muted-foreground text-lg font-medium mt-2 flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-green-500" /> Secure Encryption Active
                        </p>
                    </motion.div>
                    
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <Button variant="ghost" onClick={handleLogout} className="h-14 rounded-2xl px-8 border border-white/10 font-black hover:bg-rose-500/10 hover:text-rose-500 gap-3">
                            <LogOut className="w-5 h-5" /> Logout Session
                        </Button>
                    </motion.div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Sidebar / Stats */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-1 space-y-8">
                        <div className="bg-white/70 dark:bg-black/40 backdrop-blur-xl p-8 rounded-[40px] border border-white/20 shadow-xl text-center">
                            <div className="w-32 h-32 bg-gradient-to-br from-primary to-rose-600 rounded-[48px] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary/20 group relative">
                                <span className="text-4xl font-black text-white">{profile?.blood_type || '?'}</span>
                                <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-background flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-black">{profile?.name || 'New Member'}</h3>
                            <p className="text-muted-foreground font-bold text-xs tracking-widest uppercase mt-1">Level 1 Lifesaver</p>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div className="bg-primary/5 p-6 rounded-[32px] border border-primary/10">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Impact Factor</p>
                                <p className="text-3xl font-black text-primary">0 Lives</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Main Settings Card */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2">
                        <div className="bg-white/70 dark:bg-black/40 backdrop-blur-xl p-8 md:p-12 rounded-[40px] border border-white/20 shadow-xl">
                            <div className="flex items-center justify-between mb-10">
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">Vault Information</h3>
                                {!isEditing && (
                                    <Button variant="outline" onClick={() => setIsEditing(true)} className="rounded-2xl font-black h-10 border-white/20">
                                        Edit Details
                                    </Button>
                                )}
                            </div>

                            <div className="space-y-8">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Full Name</Label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary" />
                                            <Input disabled={!isEditing} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="h-14 pl-12 rounded-2xl bg-white/50 dark:bg-black/20 border-white/20" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Verified Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input disabled value={user.email} className="h-14 pl-12 rounded-2xl bg-muted/50 border-white/10 opacity-70" />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Secure Phone</Label>
                                        <div className="relative group">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary" />
                                            <Input disabled={!isEditing} value={formData.contact_phone} onChange={e => setFormData({...formData, contact_phone: e.target.value})} className="h-14 pl-12 rounded-2xl bg-white/50 dark:bg-black/20 border-white/20" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Operation City</Label>
                                        <div className="relative group">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary" />
                                            <Input disabled={!isEditing} value={formData.location_city} onChange={e => setFormData({...formData, location_city: e.target.value})} className="h-14 pl-12 rounded-2xl bg-white/50 dark:bg-black/20 border-white/20" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Operational State</Label>
                                    <Input disabled={!isEditing} value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="h-14 rounded-2xl bg-white/50 dark:bg-black/20 border-white/20" />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Detailed Address</Label>
                                    <textarea 
                                        disabled={!isEditing} 
                                        value={formData.location_address} 
                                        onChange={e => setFormData({...formData, location_address: e.target.value})}
                                        className="w-full p-4 rounded-2xl bg-white/50 dark:bg-black/20 border-white/20 min-h-[120px] focus:ring-2 focus:ring-primary outline-none transition-all disabled:opacity-70"
                                    />
                                </div>

                                <AnimatePresence>
                                    {isEditing && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="flex gap-4 pt-4">
                                            <Button variant="ghost" onClick={() => setIsEditing(false)} className="flex-1 h-14 rounded-2xl font-black">Cancel</Button>
                                            <Button onClick={handleSave} disabled={updateProfile.isPending} className="flex-[2] h-14 rounded-2xl font-black shadow-xl shadow-primary/20">
                                                {updateProfile.isPending ? 'Syncing...' : 'Save Vault Data'}
                                            </Button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
