export interface StudentSubjectResult {
  courseCode: string;
  courseName: string;
  credits: number;
  obtainedMarks: number;
  gradePoint: number; 
  letterGrade: string; 
  status: 'pass' | 'fail';
}

export interface StudentExamResultSummary {
  _id: string;
  examName: string;
  semesterName: string;
  gpa: number;
  status: 'pass' | 'fail';
  details: StudentSubjectResult[];
}
export default StudentExamResultSummary;
