export interface ProcessedResultOverview {
  _id: string;
  examId: string;
  examName: string;
  departmentId: string;
  departmentName: string;
  semesterId: string;
  semesterName: string;
  totalStudents: number;
  status: 'draft' | 'published';
  createdAt: string;
}
export default ProcessedResultOverview;
