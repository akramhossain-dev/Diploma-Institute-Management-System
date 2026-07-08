'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { SectionHeader } from '@/components/shared/layout/SectionHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { useUiStore } from '@/store/ui/uiStore';
import { useAdminTeachers } from '@/hooks/admin/useAdminTeachers';
import { useAdminDepartments } from '@/hooks/admin/useAdminDepartments';
import { useAdminSemesters } from '@/hooks/admin/useAdminSemesters';
import { useAdminCourses } from '@/hooks/admin/useAdminCourses';
import {
  useRoutine,
  useCreateRoutine,
  useUpdateRoutine,
  useDeleteRoutine,
} from '@/hooks/admin/useRoutine';
import { RoutineSlot, routineFormSchema, DayOfWeek } from '@/types/admin/routine.types';
import { LucideIcon } from '@/components/shared/navigation/LucideIcon';

const DAYS: DayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'];

export default function RoutineManagementPage() {
  const addToast = useUiStore((state) => state.addToast);

  // Queries & Mutations
  const { data: slots = [], isLoading } = useRoutine();
  const { data: teachers = [] } = useAdminTeachers();
  const { data: departments = [] } = useAdminDepartments();
  const { data: semesters = [] } = useAdminSemesters();
  const { data: courses = [] } = useAdminCourses();

  const createMutation = useCreateRoutine();
  const updateMutation = useUpdateRoutine();
  const deleteMutation = useDeleteRoutine();

  // State management
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<RoutineSlot | null>(null);

  // Filter states
  const [deptFilter, setDeptFilter] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('');

  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(routineFormSchema),
  });

  const handleOpenCreate = () => {
    setSelectedSlot(null);
    reset({
      day: 'sunday',
      startTime: '09:00',
      endTime: '10:00',
      departmentId: '',
      semesterId: '',
      courseId: '',
      teacherId: '',
      room: '',
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (slot: RoutineSlot) => {
    setSelectedSlot(slot);
    reset({
      day: slot.day,
      startTime: slot.startTime,
      endTime: slot.endTime,
      departmentId: slot.departmentId,
      semesterId: slot.semesterId,
      courseId: slot.courseId,
      teacherId: slot.teacherId,
      room: slot.room,
    });
    setIsFormOpen(true);
  };

  const handleOpenDelete = (slot: RoutineSlot) => {
    setSelectedSlot(slot);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (selectedSlot) {
        await updateMutation.mutateAsync({ id: selectedSlot._id, data });
        addToast('Routine time slot updated successfully', 'success');
      } else {
        await createMutation.mutateAsync(data);
        addToast('Class schedule slot added successfully', 'success');
      }
      setIsFormOpen(false);
    } catch (err) {
      addToast('An error occurred. Please try again.', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedSlot) return;
    try {
      await deleteMutation.mutateAsync(selectedSlot._id);
      addToast('Routine entry removed successfully', 'success');
      setIsDeleteOpen(false);
    } catch (err) {
      addToast('Deletion failed. Please try again.', 'error');
    }
  };

  // Filter slots dynamically
  const filteredSlots = React.useMemo(() => {
    return slots.filter((slot) => {
      const matchDept = !deptFilter || slot.departmentId === deptFilter;
      const matchSem = !semesterFilter || slot.semesterId === semesterFilter;
      return matchDept && matchSem;
    });
  }, [slots, deptFilter, semesterFilter]);

  return (
    <PageContainer>
      <SectionHeader
        title="Class Routine Planner"
        description="Schedule weekly classes routines, assign lecture rooms, and resolve teacher timing conflicts."
        action={<Button onClick={handleOpenCreate}>Add Schedule Slot</Button>}
      />

      {/* Routine filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 max-w-xl">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground uppercase">Filter Technology</label>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-xs shadow-xs focus-visible:outline-hidden"
          >
            <option value="">Choose technology...</option>
            {departments.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-muted-foreground uppercase">Filter Semester</label>
          <select
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-xs shadow-xs focus-visible:outline-hidden"
          >
            <option value="">Choose semester...</option>
            {semesters.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Weekly Schedule Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {DAYS.map((day) => {
          const daySlots = filteredSlots.filter((slot) => slot.day === day);
          return (
            <div key={day} className="space-y-3">
              <div className="bg-muted p-2 rounded-md text-center border font-bold capitalize text-xs text-foreground tracking-wider">
                {day}
              </div>
              <div className="space-y-3 min-h-[200px] border border-dashed rounded-md p-2 bg-muted/20">
                {daySlots.length > 0 ? (
                  daySlots.map((slot) => (
                    <Card key={slot._id} className="border shadow-xs hover:shadow-md transition-shadow">
                      <CardContent className="p-3 space-y-2 text-xs relative group">
                        <div className="absolute right-2 top-2 hidden group-hover:flex gap-1 bg-background/90 p-1 border rounded-md shadow-xs">
                          <button onClick={() => handleOpenEdit(slot)} className="text-primary hover:text-primary-focus">
                            <LucideIcon name="Edit" size={12} />
                          </button>
                          <button onClick={() => handleOpenDelete(slot)} className="text-destructive hover:text-destructive-focus">
                            <LucideIcon name="Trash" size={12} />
                          </button>
                        </div>
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

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {selectedSlot ? 'Edit Routine Slot' : 'Add Routine Slot'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold">Day of Week</label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden"
                  {...register('day')}
                >
                  <option value="sunday">Sunday</option>
                  <option value="monday">Monday</option>
                  <option value="tuesday">Tuesday</option>
                  <option value="wednesday">Wednesday</option>
                  <option value="thursday">Thursday</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold">Room/Lab No</label>
                <Input placeholder="e.g. Room 302" error={errors.room?.message as string} {...register('room')} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold">Start Time (24h)</label>
                <Input type="time" error={errors.startTime?.message as string} {...register('startTime')} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold">End Time (24h)</label>
                <Input type="time" error={errors.endTime?.message as string} {...register('endTime')} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold">Technology</label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden"
                  {...register('departmentId')}
                >
                  <option value="">Select department...</option>
                  {departments.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.name}
                    </option>
                  ))}
                </select>
                {errors.departmentId && (
                  <span className="text-xs text-destructive">{errors.departmentId.message as string}</span>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold">Semester Level</label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden"
                  {...register('semesterId')}
                >
                  <option value="">Select semester...</option>
                  {semesters.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                {errors.semesterId && (
                  <span className="text-xs text-destructive">{errors.semesterId.message as string}</span>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold">Select Course</label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden"
                {...register('courseId')}
              >
                <option value="">Select syllabus course...</option>
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
              {errors.courseId && (
                <span className="text-xs text-destructive">{errors.courseId.message as string}</span>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold">Select Teacher</label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden"
                {...register('teacherId')}
              >
                <option value="">Select faculty instructor...</option>
                {teachers.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.fullName}
                  </option>
                ))}
              </select>
              {errors.teacherId && (
                <span className="text-xs text-destructive">{errors.teacherId.message as string}</span>
              )}
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>
                Save Slot
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
      />
    </PageContainer>
  );
}
