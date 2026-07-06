/**
 * Grading Utility — Phase 7
 *
 * Centralized, reusable grade calculation logic.
 * Follows a Bangladesh BTEB-style diploma grading scale by default.
 *
 * Future-readiness:
 *   - gradeScale can be loaded from InstituteSettings (Phase 5) to make it
 *     configurable per institute without touching this utility.
 *   - Pass through a custom gradeScale array to override defaults.
 *
 * Default scale (BTEB Diploma standard):
 *   ≥ 80  → A+  (4.0)
 *   ≥ 70  → A   (3.5)
 *   ≥ 60  → A-  (3.0)
 *   ≥ 50  → B   (2.5)
 *   ≥ 40  → C   (2.0)
 *   ≥ 33  → D   (1.0)
 *    < 33  → F   (0.0)
 */

export const DEFAULT_GRADE_SCALE = [
  { minPercent: 80, letterGrade: "A+", gradePoint: 4.0 },
  { minPercent: 70, letterGrade: "A",  gradePoint: 3.5 },
  { minPercent: 60, letterGrade: "A-", gradePoint: 3.0 },
  { minPercent: 50, letterGrade: "B",  gradePoint: 2.5 },
  { minPercent: 40, letterGrade: "C",  gradePoint: 2.0 },
  { minPercent: 33, letterGrade: "D",  gradePoint: 1.0 },
  { minPercent: 0,  letterGrade: "F",  gradePoint: 0.0 },
];

/**
 * Get letter grade + grade point for a given percentage.
 * @param {number} percentage    0–100
 * @param {Array}  gradeScale    Optional override (sorted descending by minPercent)
 * @returns {{ letterGrade: string, gradePoint: number }}
 */
export function getGradeInfo(percentage, gradeScale = DEFAULT_GRADE_SCALE) {
  const grade = gradeScale.find((g) => percentage >= g.minPercent);
  return grade ?? gradeScale[gradeScale.length - 1];   // fallback → F
}

/**
 * Compute result for a single course/subject.
 *
 * @param {number} obtainedMarks   Marks obtained by student
 * @param {number} fullMarks       Maximum possible marks
 * @param {number} passMarks       Minimum marks required to pass
 * @param {Array}  gradeScale      Optional override
 * @returns {{
 *   percentage: number,
 *   letterGrade: string,
 *   gradePoint: number,
 *   passFailStatus: 'pass'|'fail'
 * }}
 */
export function computeCourseResult(obtainedMarks, fullMarks, passMarks, gradeScale = DEFAULT_GRADE_SCALE) {
  const percentage = fullMarks > 0
    ? Math.round((obtainedMarks / fullMarks) * 10000) / 100  // 2 decimal places
    : 0;

  const passFailStatus = obtainedMarks >= passMarks ? "pass" : "fail";

  if (passFailStatus === "fail") {
    return { percentage, letterGrade: "F", gradePoint: 0.0, passFailStatus };
  }

  const { letterGrade, gradePoint } = getGradeInfo(percentage, gradeScale);
  return { percentage, letterGrade, gradePoint, passFailStatus };
}

/**
 * Compute exam summary from an array of per-course results.
 *
 * Uses full-marks-weighted GPA to give heavier courses more weight.
 * Falls back to simple average if all fullMarks are equal.
 *
 * @param {Array<{
 *   courseId, examCourseMappingId,
 *   obtainedMarks, fullMarks, passMarks,
 *   percentage, gradePoint, letterGrade, passFailStatus
 * }>} courseResults
 * @param {Array} gradeScale  Optional override
 * @returns {{
 *   totalFullMarks, totalMarksObtained, overallPercentage,
 *   gpa, totalPassedCourses, totalFailedCourses,
 *   overallPassFailStatus, resultLetterGrade
 * }}
 */
export function computeExamSummary(courseResults, gradeScale = DEFAULT_GRADE_SCALE) {
  if (!courseResults.length) {
    return {
      totalFullMarks:      0,
      totalMarksObtained:  0,
      overallPercentage:   0,
      gpa:                 0,
      totalPassedCourses:  0,
      totalFailedCourses:  0,
      overallPassFailStatus: "fail",
      resultLetterGrade:   "F",
    };
  }

  const totalFullMarks     = courseResults.reduce((s, r) => s + r.fullMarks,     0);
  const totalMarksObtained = courseResults.reduce((s, r) => s + r.obtainedMarks, 0);
  const totalPassedCourses = courseResults.filter((r) => r.passFailStatus === "pass").length;
  const totalFailedCourses = courseResults.filter((r) => r.passFailStatus === "fail").length;

  const overallPercentage = totalFullMarks > 0
    ? Math.round((totalMarksObtained / totalFullMarks) * 10000) / 100
    : 0;

  // Weighted GPA: sum(gradePoint * fullMarks) / totalFullMarks
  const weightedGpaSum = courseResults.reduce((s, r) => s + r.gradePoint * r.fullMarks, 0);
  const gpa = totalFullMarks > 0
    ? Math.round((weightedGpaSum / totalFullMarks) * 100) / 100
    : 0;

  const overallPassFailStatus = totalFailedCourses === 0 ? "pass" : "fail";
  const { letterGrade: resultLetterGrade } = getGradeInfo(overallPercentage, gradeScale);

  return {
    totalFullMarks,
    totalMarksObtained,
    overallPercentage,
    gpa,
    totalPassedCourses,
    totalFailedCourses,
    overallPassFailStatus,
    resultLetterGrade: overallPassFailStatus === "fail" ? "F" : resultLetterGrade,
  };
}
