import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/providers/auth-provider';
import { createCourse, deleteCourse, listCourses, type NewCourse } from '@/services/Courses';

export function useCourses() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['courses'],
    queryFn: () => (user ? listCourses(user.uid) : []),
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: (data: NewCourse) => {
      if (!user) throw new Error('Not authenticated');
      return createCourse(user.uid, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (courseId: string) => {
      if (!user) throw new Error('Not authenticated');
      return deleteCourse(user.uid, courseId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });

  return {
    courses: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    createCourse: createMutation,
    deleteCourse: deleteMutation,
  };
}
