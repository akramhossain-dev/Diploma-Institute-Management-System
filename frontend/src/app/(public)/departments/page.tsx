import React from 'react';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { SectionHeader } from '@/components/shared/layout/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DepartmentsPage() {
  const departments = [
    { code: 'CST', name: 'Computer Science and Technology', semesters: 8 },
    { code: 'ENT', name: 'Electronics Technology', semesters: 8 },
    { code: 'CE', name: 'Civil Engineering Technology', semesters: 8 },
    { code: 'ME', name: 'Mechanical Engineering Technology', semesters: 8 },
  ];

  return (
    <PageContainer>
      <SectionHeader
        title="Departments"
        description="Browse the list of academic departments and programs."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {departments.map((dept) => (
          <Card key={dept.code} className="border shadow-xs">
            <CardHeader>
              <CardTitle className="flex justify-between items-center text-lg">
                <span>{dept.name}</span>
                <span className="text-xs bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-bold">
                  {dept.code}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This department offers a 4-year Diploma in Engineering program spanning {dept.semesters} semesters, covering core vocational technologies and laboratory practice.
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
