import { useQuery } from '@tanstack/react-query';
import { teacherCourseService } from '@/services/teacher/teacher-course.service';

export function useAssignedCourses() {
  return useQuery({
    queryKey: ['teacher', 'assigned-courses'],
    queryFn: () => teacherCourseService.getAssignedCourses(),
  });
}

export function useCourseStudents(courseId: string) {
  return useQuery({
    queryKey: ['teacher', 'assigned-courses', courseId, 'students'],
    queryFn: () => teacherCourseService.getCourseStudents(courseId),
    enabled: !!courseId,
  });
}
