import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { supabase } from '../lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Droplet, Menu, LogOut, User } from 'lucide-react';
import { ProfileSidebar } from './ProfileSidebar';
import { toast } from 'sonner';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (_event === 'SIGNED_OUT') {
        queryClient.clear();
      }
    });

    return () => subscription.unsubscribe();
  }, [queryClient]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Logout failed');
    } else {
      toast.success('Logged out successfully');
      navigate({ to: '/' });
    }
  };

  const navItems = [
    { label: 'Request Blood', path: '/request-blood' },
    { label: 'Donate Blood', path: '/donor-dashboard' },
    { label: 'My Requests', path: '/status-tracking' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/70 dark:bg-black/60 backdrop-blur-xl transition-all duration-300">
      <div className="container flex h-20 items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate({ to: '/' })}>
          <div className="bg-primary/10 p-2.5 rounded-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-inner">
            <Droplet className="h-7 w-7 text-primary fill-current" />
          </div>
          <span className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-rose-600">HelpConnect</span>
        </div>

        <nav className="hidden lg:flex items-center gap-2 bg-white/40 dark:bg-white/5 p-1.5 rounded-full border border-white/20 shadow-inner">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate({ to: item.path })}
              className={`text-xs font-black uppercase tracking-[0.1em] px-6 py-3 rounded-full transition-all duration-300 ${
                isActive(item.path) 
                ? 'text-white bg-primary shadow-lg shadow-primary/20' 
                : 'text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-3">
              <ProfileSidebar />
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="icon"
                className="rounded-2xl hover:bg-rose-500/10 hover:text-rose-500 hidden md:flex"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => navigate({ to: '/login' })}
              className="rounded-full px-8 h-12 font-black tracking-widest text-xs uppercase shadow-xl shadow-primary/20"
            >
              Join Network
            </Button>
          )}

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="rounded-2xl bg-white/50 dark:bg-white/5">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] border-l-white/10 bg-white/95 dark:bg-black/95 backdrop-blur-xl">
              <nav className="flex flex-col gap-6 mt-12">
                <p className="text-[10px] font-black tracking-[0.3em] text-muted-foreground uppercase opacity-50">Navigation</p>
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate({ to: item.path });
                      setMobileMenuOpen(false);
                    }}
                    className={`text-left text-2xl font-black tracking-tighter transition-all hover:translate-x-2 ${isActive(item.path) ? 'text-primary' : 'text-muted-foreground'}`}
                  >
                    {item.label}
                  </button>
                ))}
                
                <div className="h-px bg-white/10 my-4" />
                
                {session ? (
                   <div className="space-y-6">
                      <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-3xl border border-primary/10">
                        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white font-black text-xl">
                          {session.user.email?.[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase text-muted-foreground">Active Session</p>
                          <p className="font-bold text-sm truncate w-32">{session.user.email}</p>
                        </div>
                      </div>
                      <Button onClick={handleLogout} variant="outline" className="w-full h-14 rounded-2xl font-black gap-2">
                        <LogOut className="w-4 h-4" /> Logout
                      </Button>
                   </div>
                ) : (
                  <Button onClick={() => { navigate({ to: '/login' }); setMobileMenuOpen(false); }} className="w-full h-14 rounded-2xl font-black shadow-xl shadow-primary/20">
                    Join the Network
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
