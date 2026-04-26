import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from '@tanstack/react-router';
import { useGetMyDonorProfile } from '../hooks/useDonors';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { data: profile, isLoading } = useGetMyDonorProfile();

    useEffect(() => {
        // Only run check if profile is loaded and we are not already on onboarding/login/home
        if (!isLoading && profile) {
            const isComplete = 
                profile.name && 
                profile.blood_type && 
                profile.blood_type !== 'Unknown' && 
                profile.location_city && 
                profile.contact_phone;

            const isWhitelistedPage = 
                location.pathname === '/onboarding' || 
                location.pathname === '/login';

            if (!isComplete && !isWhitelistedPage) {
                navigate({ to: '/onboarding' });
            }
        }
    }, [profile, isLoading, location.pathname, navigate]);

    return (
        <div className="flex min-h-screen flex-col bg-background selection:bg-primary selection:text-white">
            <Header />
            <main className="flex-1 relative">
                {/* Subtle Global Accent Gradients */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_-10%,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent -z-10 pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_80%,_var(--tw-gradient-stops))] from-rose-500/5 via-transparent to-transparent -z-10 pointer-events-none" />

                <div className="relative">
                    <Outlet />
                </div>
            </main>
            <Footer />
        </div>
    );
}
