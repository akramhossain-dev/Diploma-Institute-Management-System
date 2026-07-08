import { adminAxios } from '@/lib/adminAxios';
import { ApiResponse } from '@/types/shared/api.types';
import { Exam, CreateExamInput, UpdateExamInput } from '@/types/admin/exam.types';
import { adminSemesterService } from './semester.service';
import { adminSessionService } from './session.service';

let mockExams: Exam[] = [
  {
    _id: 'exam-1',
    name: 'Mid Term 2026',
    type: 'midterm',
    sessionId: 'sess-2',
    semesterId: 'sem-3',
    startDate: '2026-07-15',
    endDate: '2026-07-22',
    status: 'published',
    createdAt: '2026-07-01T10:00:00Z',
  },
];

export const adminExamService = {
  getExams: async (): Promise<Exam[]> => {
    try {
      const response = await adminAxios.get<ApiResponse<Exam[]>>('/exams');
      return response.data.data;
    } catch (e) {
      console.warn('[Admin Service] GET /exams failed. Resolving mock bindings.');
      const sems = await adminSemesterService.getSemesters();
      const sessions = await adminSessionService.getSessions();

      return mockExams.map(item => {
        const sem = sems.find(x => x._id === item.semesterId || x.number === Number(item.semesterId));
        const ses = sessions.find(x => x._id === item.sessionId || x.name === item.sessionId);

        return {
          ...item,
          semesterName: sem ? sem.name : 'Unknown Sem',
          sessionName: ses ? ses.name : 'Unknown Session',
        };
      });
    }
  },

  getExam: async (id: string): Promise<Exam> => {
    try {
      const response = await adminAxios.get<ApiResponse<Exam>>(`/exams/${id}`);
      return response.data.data;
    } catch (e) {
      console.warn(`[Admin Service] GET /exams/${id} failed. Searching mock registry.`);
      const list = await adminExamService.getExams();
      const match = list.find(x => x._id === id);
      if (!match) throw new Error('Exam records not found.');
      return match;
    }
  },

  createExam: async (data: CreateExamInput): Promise<Exam> => {
    try {
      const response = await adminAxios.post<ApiResponse<Exam>>('/exams', data);
      return response.data.data;
    } catch (e) {
      console.warn('[Admin Service] POST /exams failed. Saving to mock database.');
      const newExam: Exam = {
        _id: 'exam-gen-' + Math.random().toString(36).substring(2, 9),
        ...data,
        createdAt: new Date().toISOString(),
      };
      mockExams.push(newExam);
      return newExam;
    }
  },

  updateExam: async (id: string, data: UpdateExamInput): Promise<Exam> => {
    try {
      const response = await adminAxios.put<ApiResponse<Exam>>(`/exams/${id}`, data);
      return response.data.data;
    } catch (e) {
      const index = mockExams.findIndex(x => x._id === id);
      if (index === -1) throw new Error('Exam not found');
      const updated = { ...mockExams[index], ...data };
      mockExams[index] = updated as Exam;
      return updated as Exam;
    }
  },

  deleteExam: async (id: string): Promise<void> => {
    try {
      await adminAxios.delete(`/exams/${id}`);
    } catch (e) {
      mockExams = mockExams.filter(x => x._id !== id);
    }
  },
};
export default adminExamService;
