import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { supabase } from '../lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { Mail, Lock, ArrowRight, Activity, Heart, Droplets } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const generateChartData = () => {
    return Array.from({ length: 20 }).map((_, i) => ({
        name: `Point ${i}`,
        value: Math.sin(i * 0.5) * 40 + 60 + Math.random() * 15,
    }));
};

export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const chartData = useMemo(() => generateChartData(), []);

    // 2. Clear redirect logic for Supabase
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session) {
                toast.success('Access Granted');
            navigate({ to: '/onboarding' });
            }
        });
        return () => subscription.unsubscribe();
    }, [navigate]);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return toast.error('Please enter both email and password');

        try {
            setLoading(true);
            console.log(`Attempting ${isSignUp ? 'SignUp' : 'SignIn'} for:`, email);

            if (isSignUp) {
                const { data, error } = await supabase.auth.signUp({ 
                    email, 
                    password,
                    options: { data: { name: email.split('@')[0] } } 
                });
                if (error) throw error;
                if (data.user && data.session) {
                    toast.success('Account created! Let\'s set up your profile.');
                    navigate({ to: '/onboarding' });
                } else {
                    toast.success('Registration successful! Please check your email or try signing in.');
                    setIsSignUp(false);
                }
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) {
                    // If sign in fails, it might be because the account doesn't exist
                    if (error.message.toLowerCase().includes("invalid login credentials")) {
                        toast.error("Account not found or wrong password. Try 'Create Account' if you are new!", { duration: 6000 });
                        return;
                    }
                    throw error;
                }
                // Redirect is handled by the useEffect listener
            }
        } catch (error: any) {
            console.error('SUPABASE AUTH ERROR:', error);
            toast.error(error.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#fafafa] dark:bg-[#02040a] px-4">
            
            {/* --- PREMIUM BACKGROUND ELEMENTS --- */}
            
            {/* Animated Mesh Gradients */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <motion.div 
                    animate={{ 
                        x: [0, 50, 0], 
                        y: [0, 30, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full"
                />
                <motion.div 
                    animate={{ 
                        x: [0, -40, 0], 
                        y: [0, 60, 0],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-rose-400/10 blur-[150px] rounded-full"
                />
            </div>

            {/* Subtle Dynamic Chart Background */}
            <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.07] pointer-events-none">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <Area type="monotone" dataKey="value" stroke="var(--primary)" fill="var(--primary)" fillOpacity={1} strokeWidth={0} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Subtle Floating Indicators */}
            <div className="absolute inset-0 z-0 pointer-events-none hidden lg:block">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="absolute top-[15%] left-[10%] flex items-center gap-3 bg-white/40 dark:bg-white/5 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 shadow-sm"
                >
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Network Active 🇮🇳</span>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="absolute bottom-[20%] right-[10%] flex items-center gap-3 bg-white/40 dark:bg-white/5 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 shadow-sm"
                >
                    <Activity className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Live Coordination</span>
                </motion.div>
            </div>

            {/* --- MAIN LOGIN INTERFACE --- */}
            
            <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", damping: 25, stiffness: 100 }}
                className="relative z-10 w-full max-w-[440px] px-2 sm:px-0"
            >
                {/* Visual Accent (Logo-like) */}
                <div className="flex justify-center mb-8">
                    <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="bg-white dark:bg-white/5 p-4 rounded-[28px] shadow-xl border border-white/20 backdrop-blur-xl relative"
                    >
                        <div className="absolute inset-0 bg-primary/10 blur-xl rounded-full animate-pulse" />
                        <Droplets className="w-10 h-10 text-primary relative z-10" />
                    </motion.div>
                </div>

                <Card className="overflow-hidden border-white/20 dark:border-white/5 bg-white/70 dark:bg-black/40 backdrop-blur-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[32px] border">
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-30" />
                    
                    <CardHeader className="pt-10 pb-6 text-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={isSignUp ? 'signup' : 'signin'}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <CardTitle className="text-3xl font-black tracking-tight mb-2">
                                    {isSignUp ? 'Join the Cause 🩸' : 'Welcome Back ✨'}
                                </CardTitle>
                                <CardDescription className="text-base font-medium text-muted-foreground px-6">
                                    {isSignUp 
                                        ? "Register to start saving lives today." 
                                        : "Your contribution makes a world of difference."
                                    }
                                </CardDescription>
                            </motion.div>
                        </AnimatePresence>
                    </CardHeader>

                    <CardContent className="px-8 pb-8">
                        {!import.meta.env.VITE_SUPABASE_URL && (
                            <Alert variant="destructive" className="mb-6 rounded-2xl bg-destructive/5 border-destructive/20">
                                <AlertDescription className="text-xs font-bold text-center">
                                    SUPABASE CONFIGURATION MISSING
                                </AlertDescription>
                            </Alert>
                        )}

                        <form onSubmit={handleAuth} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Email</Label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="h-14 pl-12 rounded-2xl bg-white/50 dark:bg-black/20 border-white/20 dark:border-white/5 focus:ring-primary focus:border-primary transition-all text-base"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Password</Label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="h-14 pl-12 rounded-2xl bg-white/50 dark:bg-black/20 border-white/20 dark:border-white/5 focus:ring-primary focus:border-primary transition-all text-base"
                                        required
                                    />
                                </div>
                            </div>

                            <Button 
                                type="submit" 
                                disabled={loading}
                                className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-xl shadow-primary/20 transition-all active:scale-[0.98] mt-4"
                            >
                                {loading ? (
                                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                                        <Activity className="w-5 h-5" />
                                    </motion.div>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        {isSignUp ? 'Create Account' : 'Sign In'}
                                        <ArrowRight className="w-5 h-5" />
                                    </span>
                                )}
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="bg-muted/30 dark:bg-white/5 border-t border-white/10 p-6 flex justify-center">
                        <Button 
                            variant="link" 
                            className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
                            onClick={() => setIsSignUp(!isSignUp)}
                        >
                            {isSignUp ? 'Already have an account? Sign in' : "New to HelpConnect? Create account"}
                        </Button>
                    </CardFooter>
                </Card>

                <p className="mt-8 text-center text-xs font-bold tracking-widest text-muted-foreground uppercase opacity-50">
                    Secure & Verified Blood Network 🇮🇳
                </p>
            </motion.div>
        </div>
    );
}
