import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { UserProfile } from '@/lib/types';
import { useAuth } from '@/providers/auth-provider';
import { createProfile, deleteProfile, getProfile, updateProfile } from '@/services/Profile';

export function useProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['profile'],
    queryFn: () => (user ? getProfile(user.uid) : null),
    enabled: !!user,
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: Partial<UserProfile>) => {
      if (!user) throw new Error('Not authenticated');
      return updateProfile(user.uid, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  const createProfileMutation = useMutation({
    mutationFn: (data: Partial<UserProfile>) => {
      if (!user) throw new Error('Not authenticated');
      return createProfile(user.uid, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  const deleteProfileMutation = useMutation({
    mutationFn: () => {
      if (!user) throw new Error('Not authenticated');
      return deleteProfile(user.uid);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  return {
    profileData: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    updateProfile: updateProfileMutation,
    createProfile: createProfileMutation,
    deleteProfile: deleteProfileMutation,
  };
}
