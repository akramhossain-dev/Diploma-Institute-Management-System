import { test } from "node:test";
import assert from "node:assert";
import { performance } from "perf_hooks";

// Mock attendance record structure
function generateMockRecords(count) {
  const statuses = ["present", "absent", "late", "excused"];
  const records = [];

  for (let i = 0; i < count; i++) {
    records.push({
      studentId: `student_${i % 100}`, // 100 distinct students
      courseId: `course_${i % 5}`,     // 5 distinct courses
      status: statuses[i % 4],
      attendanceDate: new Date(Date.now() - (i % 30) * 24 * 60 * 60 * 1000), // last 30 days
    });
  }

  return records;
}

// Emulate attendance aggregation logic running in JS
function compileAttendanceSummary(records) {
  const courseGroups = {};

  for (const r of records) {
    if (!courseGroups[r.courseId]) {
      courseGroups[r.courseId] = {
        courseId: r.courseId,
        totalClasses: 0,
        presentCount: 0,
        absentCount: 0,
        lateCount: 0,
        excusedCount: 0,
      };
    }

    const group = courseGroups[r.courseId];
    group.totalClasses++;

    if (r.status === "present") group.presentCount++;
    else if (r.status === "absent") group.absentCount++;
    else if (r.status === "late") group.lateCount++;
    else if (r.status === "excused") group.excusedCount++;
  }

  // Calculate percentages
  const results = Object.values(courseGroups).map((group) => {
    const presentRate = ((group.presentCount + group.lateCount) / group.totalClasses) * 100;
    return {
      ...group,
      attendancePercent: Math.round(presentRate * 10) / 10,
      isEligible: presentRate >= 75.0,
    };
  });

  return results;
}

test("Performance Benchmark — Attendance Compilation Time", async (t) => {
  await t.test("should compile 10,000 records under 50ms", () => {
    const count = 10000;
    const records = generateMockRecords(count);

    // Warmup
    compileAttendanceSummary(records.slice(0, 100));

    // Performance measurement
    const startTime = performance.now();
    const result = compileAttendanceSummary(records);
    const endTime = performance.now();

    const duration = endTime - startTime;
    console.log(`\n[Performance Benchmark] Compiled ${count} attendance records in ${duration.toFixed(2)}ms`);

    assert.ok(result.length > 0);
    assert.ok(duration < 50, `Compilation took too long: ${duration.toFixed(2)}ms (limit 50ms)`);
  });
});
