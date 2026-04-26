
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

// Types matching the SQL schema
export interface DonorProfile {
    id: string;
    user_id: string;
    name: string;
    blood_type: string;
    location_city: string;
    location_address: string;
    location_lat?: number;
    location_lng?: number;
    contact_phone: string;
    email?: string;
    state?: string;
    is_available: boolean;
    last_donation_date?: string;
    created_at: string;
    updated_at: string;
}

export const DONOR_KEYS = {
    all: ['donors'] as const,
    profile: (userId: string) => [...DONOR_KEYS.all, 'profile', userId] as const,
};

// Fetch current user's donor profile
export const useGetMyDonorProfile = () => {
    return useQuery({
        queryKey: DONOR_KEYS.profile('me'),
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return null;

            const { data, error } = await supabase
                .from('donors')
                .select('*')
                .eq('user_id', user.id)
                .maybeSingle();

            if (error) throw error;
            return data as DonorProfile | null;
        },
        enabled: true,
        staleTime: 0, // Always fetch fresh to ensure sync
    });
};

// Create or Update Donor Profile (Upsert)
export const useUpdateDonorProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (profileData: Partial<DonorProfile>) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            // 1. Check if profile exists
            const { data: existing } = await supabase
                .from('donors')
                .select('name')
                .eq('user_id', user.id)
                .maybeSingle();

            if (!existing) {
                // 2. If it doesn't exist, we must provide 'name' for the INSERT
                const { data, error } = await supabase
                    .from('donors')
                    .insert({
                        user_id: user.id,
                        name: profileData.name || user.user_metadata?.name || 'New User',
                        blood_type: profileData.blood_type || 'Unknown',
                        location_city: profileData.location_city || 'Unknown',
                        contact_phone: profileData.contact_phone || 'Unknown',
                        ...profileData,
                        updated_at: new Date().toISOString(),
                    })
                    .select()
                    .single();
                if (error) throw error;
                return data as DonorProfile;
            } else {
                // 3. If it exists, we can safely partial update
                const { data, error } = await supabase
                    .from('donors')
                    .update({
                        ...profileData,
                        updated_at: new Date().toISOString(),
                    })
                    .eq('user_id', user.id)
                    .select()
                    .single();
                if (error) throw error;
                return data as DonorProfile;
            }

            if (error) throw error;
            return data as DonorProfile;
        },
        onSuccess: () => {
            // Invalidate everything related to donors to ensure UI sync
            queryClient.invalidateQueries({ queryKey: DONOR_KEYS.all });
            toast.success('Profile updated successfully!');
        },
        onError: (error: any) => {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile', {
                description: error.message || 'Please try again.',
            });
        },
    });
};
