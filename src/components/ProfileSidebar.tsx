import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useGetMyDonorProfile, useUpdateDonorProfile } from '../hooks/useDonors';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Settings, Save, Loader2, MapPin, Phone, Droplet, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export function ProfileSidebar() {
    const { data: currentDonor, isLoading } = useGetMyDonorProfile();
    const updateProfileMutation = useUpdateDonorProfile();

    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useState<any>(null);

    // Form States
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');
    const [bloodType, setBloodType] = useState<string>('');
    const [isAvailable, setIsAvailable] = useState(false);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
        });
    }, []);

    useEffect(() => {
        if (currentDonor) {
            setName(currentDonor.name || '');
            setPhone(currentDonor.contact_phone || '');
            setCity(currentDonor.location_city || '');
            setAddress(currentDonor.location_address || '');
            setBloodType(currentDonor.blood_type || '');
            setIsAvailable(currentDonor.is_available);
        }
    }, [currentDonor, isOpen]);

    const handleSave = async () => {
        if (!name || !phone || !city || !bloodType) {
            toast.error('Required fields: Name, Phone, City, Blood Type');
            return;
        }

        try {
            await updateProfileMutation.mutateAsync({
                name,
                contact_phone: phone,
                location_city: city,
                location_address: address,
                blood_type: bloodType,
                is_available: isAvailable,
            });
            setIsEditing(false);
        } catch (error) {}
    };

    if (!user) return null;

    return (
        <Sheet open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) setIsEditing(false);
        }}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-2xl w-12 h-12 bg-white/40 dark:bg-white/5 border border-white/20 hover:scale-110 transition-all shadow-lg backdrop-blur-md">
                    <Settings className="h-5 w-5 text-primary" />
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:w-[500px] border-l-white/10 bg-white/95 dark:bg-black/95 backdrop-blur-2xl">
                <SheetHeader className="mb-8">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="text-3xl font-black tracking-tighter">Vault <span className="text-primary italic">Settings</span></SheetTitle>
                        {!isLoading && currentDonor && !isEditing && (
                            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="rounded-xl font-black border-primary/20 text-primary">
                                Edit Profile
                            </Button>
                        )}
                    </div>
                </SheetHeader>

                <AnimatePresence mode="wait">
                    {isLoading && !currentDonor ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="h-10 w-10 animate-spin text-primary" />
                            <p className="text-xs font-black tracking-widest text-muted-foreground uppercase">Retrieving Data...</p>
                        </div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            {!isEditing && currentDonor ? (
                                <div className="space-y-8">
                                    <div className="bg-primary/5 p-8 rounded-[40px] border border-primary/10 text-center relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full -mr-16 -mt-16 group-hover:scale-125 transition-transform" />
                                        <div className="w-24 h-24 bg-primary rounded-[32px] flex items-center justify-center mx-auto mb-4 shadow-xl">
                                            <span className="text-3xl font-black text-white">{currentDonor.blood_type}</span>
                                        </div>
                                        <h4 className="text-2xl font-black">{currentDonor.name}</h4>
                                        <p className="text-muted-foreground font-bold text-xs tracking-widest uppercase mt-1">Verified Donor Network</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <InfoPill icon={<MapPin className="w-4 h-4" />} label="City" value={currentDonor.location_city} />
                                        <InfoPill icon={<Phone className="w-4 h-4" />} label="Phone" value={currentDonor.contact_phone} />
                                    </div>

                                    <div className="flex items-center justify-between p-6 bg-white dark:bg-white/5 rounded-3xl border border-white/10 shadow-inner">
                                        <div className="space-y-1">
                                            <p className="text-xs font-black tracking-widest text-muted-foreground uppercase">Availability</p>
                                            <p className={`font-black text-sm ${currentDonor.is_available ? 'text-green-500' : 'text-muted-foreground'}`}>
                                                {currentDonor.is_available ? '● READY TO ASSIST' : '○ OFFLINE'}
                                            </p>
                                        </div>
                                        <Switch checked={currentDonor.is_available} disabled className="data-[state=checked]:bg-green-500" />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Full Name</Label>
                                        <Input value={name} onChange={e => setName(e.target.value)} className="h-14 rounded-2xl bg-white/50 dark:bg-white/5 border-white/20" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Blood Type</Label>
                                            <select value={bloodType} onChange={e => setBloodType(e.target.value)} className="w-full h-14 px-4 rounded-2xl bg-white/50 dark:bg-white/5 border-white/20 font-black">
                                                {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Phone</Label>
                                            <Input value={phone} onChange={e => setPhone(e.target.value)} className="h-14 rounded-2xl bg-white/50 dark:bg-white/5 border-white/20" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest ml-1">City</Label>
                                        <Input value={city} onChange={e => setCity(e.target.value)} className="h-14 rounded-2xl bg-white/50 dark:bg-white/5 border-white/20" />
                                    </div>
                                    <div className="flex items-center justify-between p-6 bg-white dark:bg-white/5 rounded-3xl border border-white/10">
                                        <div className="space-y-1">
                                            <p className="text-sm font-black">Active in Radar</p>
                                            <p className="text-xs text-muted-foreground font-medium">Be visible to emergency requests</p>
                                        </div>
                                        <Switch checked={isAvailable} onCheckedChange={setIsAvailable} className="data-[state=checked]:bg-green-500" />
                                    </div>
                                    <div className="flex gap-4 pt-4">
                                        <Button variant="ghost" onClick={() => setIsEditing(false)} className="flex-1 h-14 rounded-2xl font-black">Cancel</Button>
                                        <Button onClick={handleSave} disabled={updateProfileMutation.isPending} className="flex-[2] h-14 rounded-2xl font-black shadow-xl shadow-primary/20">
                                            {updateProfileMutation.isPending ? <Loader2 className="animate-spin" /> : <><Save className="mr-2 w-4 h-4" /> Save Vault</>}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </SheetContent>
        </Sheet>
    );
}

function InfoPill({ icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <div className="p-4 bg-white dark:bg-white/5 rounded-3xl border border-white/10 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
                {icon}
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</span>
            </div>
            <p className="font-black text-sm truncate">{value}</p>
        </div>
    );
}
