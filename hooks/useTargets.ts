import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/providers/auth-provider';
import { createTarget, deleteTarget, listTargets, type NewTarget } from '@/services/Targets';

export function useTargets() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['targets'],
    queryFn: () => (user ? listTargets(user.uid) : []),
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: (data: NewTarget) => {
      if (!user) throw new Error('Not authenticated');
      return createTarget(user.uid, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['targets'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (targetId: string) => {
      if (!user) throw new Error('Not authenticated');
      return deleteTarget(user.uid, targetId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['targets'] });
    },
  });

  return {
    targets: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    createTarget: createMutation,
    deleteTarget: deleteMutation,
  };
}
