import React from 'react';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { SectionHeader } from '@/components/shared/layout/SectionHeader';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function PublicCoursesPage() {
  const courses = [
    { code: 'CST-311', name: 'Data Structures & Algorithms', type: 'Theory & Practical', credits: 4 },
    { code: 'CST-312', name: 'Database Management Systems', type: 'Theory & Practical', credits: 4 },
    { code: 'CST-313', name: 'Web Engineering', type: 'Theory & Practical', credits: 3 },
    { code: 'MAT-311', name: 'Mathematics-III', type: 'Theory Only', credits: 3 },
  ];

  return (
    <PageContainer>
      <SectionHeader
        title="Courses Syllabus"
        description="Public view of academic courses offered this semester."
      />
      <div className="bg-card border rounded-lg overflow-hidden shadow-xs">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course Code</TableHead>
              <TableHead>Course Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Credits</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.code}>
                <TableCell className="font-semibold text-primary">{course.code}</TableCell>
                <TableCell>{course.name}</TableCell>
                <TableCell>{course.type}</TableCell>
                <TableCell className="text-right">{course.credits}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </PageContainer>
  );
}
