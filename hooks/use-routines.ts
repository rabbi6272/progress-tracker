import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/providers/auth-provider';
import {
  createRoutineSlot,
  deleteRoutineSlot,
  listRoutine,
  type NewRoutineSlot,
} from '@/services/routines';

export function useRoutines() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['routine'],
    queryFn: () => (user ? listRoutine(user.uid) : []),
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: (data: NewRoutineSlot) => {
      if (!user) throw new Error('Not authenticated');
      return createRoutineSlot(user.uid, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routine'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (slotId: string) => {
      if (!user) throw new Error('Not authenticated');
      return deleteRoutineSlot(user.uid, slotId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routine'] });
    },
  });

  return {
    slots: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    createRoutineSlot: createMutation,
    deleteRoutineSlot: deleteMutation,
  };
}
