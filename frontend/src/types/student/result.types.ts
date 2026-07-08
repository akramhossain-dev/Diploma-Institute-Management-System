export interface StudentSubjectResult {
  courseCode: string;
  courseName: string;
  credits: number;
  obtainedMarks: number;
  gradePoint: number; // e.g. 4.0
  letterGrade: string; // e.g. "A+"
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
