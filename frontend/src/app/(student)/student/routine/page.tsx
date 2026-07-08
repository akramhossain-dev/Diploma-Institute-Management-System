'use client';

import React from 'react';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { SectionHeader } from '@/components/shared/layout/SectionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { useStudentRoutine } from '@/hooks/student/useStudentRoutine';
import { DayOfWeek } from '@/types/admin/routine.types';
import { Skeleton } from '@/components/ui/skeleton';

const DAYS: DayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'];

export default function StudentRoutinePage() {
  const { data: slots = [], isLoading } = useStudentRoutine();

  return (
    <PageContainer>
      <SectionHeader
        title="My Class Routine"
        description="Verify weekly schedule, course assignments timing, and allocated classrooms room numbers."
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 animate-in fade-in-50 duration-300">
          {DAYS.map((day) => {
            const daySlots = slots.filter((slot) => slot.day === day);
            return (
              <div key={day} className="space-y-3">
                <div className="bg-primary/10 text-primary border border-primary/20 p-2 rounded-md text-center font-bold capitalize text-xs tracking-wider">
                  {day}
                </div>
                <div className="space-y-3 min-h-[160px] border border-dashed rounded-md p-2 bg-muted/20">
                  {daySlots.length > 0 ? (
                    daySlots.map((slot) => (
                      <Card key={slot._id} className="border shadow-xs">
                        <CardContent className="p-3 space-y-2 text-xs">
                          <div className="text-primary font-bold">
                            {slot.startTime} - {slot.endTime}
                          </div>
                          <div className="font-bold text-foreground truncate">{slot.courseName}</div>
                          <div className="text-muted-foreground truncate">{slot.teacherName}</div>
                          <div className="flex justify-between text-[10px] pt-1 border-t text-muted-foreground">
                            <span>Room: {slot.room}</span>
                            <span>{slot.courseCode}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <span className="text-[10px] text-muted-foreground text-center block pt-8">No classes</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </PageContainer>
  );
}
