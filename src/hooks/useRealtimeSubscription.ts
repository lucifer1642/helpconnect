import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { REQUEST_KEYS, BloodRequest } from './useRequests';
import { toast } from 'sonner';

interface RealtimeProps {
    userId?: string;
    userBloodType?: string;
    enabled?: boolean;
}

export const useRealtimeSubscription = ({ userId, userBloodType, enabled = true }: RealtimeProps) => {
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!enabled || !supabase) return;

        // Channel for Blood Requests
        const channel = supabase
            .channel('db-changes')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'blood_requests',
                },
                (payload) => {
                    const newRequest = payload.new as BloodRequest;

                    // Invalidate all requests query to show new item
                    queryClient.invalidateQueries({ queryKey: REQUEST_KEYS.all });

                    // Auto-Matching Notification
                    // If the new request is NOT from me, and matches my blood type
                    if (
                        userId &&
                        userBloodType &&
                        newRequest.donor_id !== userId &&
                        isCompatible(userBloodType, newRequest.blood_type)
                    ) {
                        toast.info('New Blood Request Match!', {
                            description: `${newRequest.recipient_name} needs ${newRequest.blood_type} blood near you.`,
                            action: {
                                label: 'View',
                                onClick: () => window.location.href = '/donor-dashboard' // Adjust route as needed
                            }
                        });
                    }
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'blood_requests',
                },
                (payload) => {
                    // Invalidate queries to update status in UI
                    queryClient.invalidateQueries({ queryKey: REQUEST_KEYS.all });

                    const updatedRequest = payload.new as BloodRequest;
                    // If this is MY request that got updated
                    if (userId && updatedRequest.donor_id === userId) {
                        queryClient.invalidateQueries({ queryKey: REQUEST_KEYS.byDonor(userId) });
                    }
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'request_responses',
                },
                (payload) => {
                    const newResponse = payload.new as any;

                    // Invalidate all request queries so both sides see updates
                    queryClient.invalidateQueries({ queryKey: REQUEST_KEYS.all });
                    
                    // Invalidate the specific request_response query for this request
                    queryClient.invalidateQueries({ queryKey: ['request_response', newResponse.request_id] });
                    
                    // Invalidate my_responses so the donor dashboard filters update
                    queryClient.invalidateQueries({ queryKey: ['my_responses'] });

                    if (userId) {
                        queryClient.invalidateQueries({ queryKey: REQUEST_KEYS.byDonor(userId) });
                        queryClient.invalidateQueries({ queryKey: REQUEST_KEYS.byDonor('me') });
                    }

                    // Notify the requester if someone accepted their request
                    if (newResponse.status === 'accepted' && newResponse.donor_id !== userId) {
                        toast.success('A donor has accepted your request! 🎉', {
                            description: 'Check your requests for details.',
                        });
                    }
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'request_responses',
                },
                (payload) => {
                    // Invalidate all response-related queries
                    queryClient.invalidateQueries({ queryKey: REQUEST_KEYS.all });
                    queryClient.invalidateQueries({ queryKey: ['request_response'] });
                    queryClient.invalidateQueries({ queryKey: ['my_responses'] });
                    if (userId) {
                        queryClient.invalidateQueries({ queryKey: REQUEST_KEYS.byDonor(userId) });
                        queryClient.invalidateQueries({ queryKey: REQUEST_KEYS.byDonor('me') });
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [enabled, userId, userBloodType, queryClient]);
};

// Helper for compatibility (duplicate logic, ideally shared)
// Helper for compatibility (Strict matching as requested)
const isCompatible = (donorType: string, recipientType: string): boolean => {
    const dt = donorType.replace('_', '').replace('positive', '+').replace('negative', '-');
    const rt = recipientType.replace('_', '').replace('positive', '+').replace('negative', '-');

    return dt === rt;
};
