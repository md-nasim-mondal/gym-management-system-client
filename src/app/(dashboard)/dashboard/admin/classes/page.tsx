"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format, addHours } from 'date-fns';
import { DataTable } from '@/components/ui/data-table';
import { useGetSchedulesQuery, useCreateScheduleMutation } from '@/redux/api/scheduleApi';
import { useGetTrainersQuery } from '@/redux/api/userApi';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { columns } from '@/components/dashboard/schedule/schedule-columns';
import { ScheduleForm } from '@/components/dashboard/schedule/schedule-form';

const ClassScheduleManagementPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // RTK Query hooks
  const { data: schedulesData, isLoading, refetch } = useGetSchedulesQuery();
  const { data: trainersData } = useGetTrainersQuery();
  const [createSchedule] = useCreateScheduleMutation();

  const schedules = schedulesData?.data?.schedules || [];
  const trainers = trainersData?.data || [];

  // Filter schedules for selected date
  const filteredSchedules = schedules.filter((schedule) => {
    if (!date) return false;
    const scheduleDate = new Date(schedule.date);
    return (
      scheduleDate.getDate() === date.getDate() &&
      scheduleDate.getMonth() === date.getMonth() &&
      scheduleDate.getFullYear() === date.getFullYear()
    );
  });

  // Check if max schedules (5) reached for selected date
  const isMaxSchedulesReached = filteredSchedules.length >= 5;

  const handleCreateSchedule = async (formData: any) => {
    setIsCreating(true);
    try {
      // Calculate end time (2 hours after start time)
      const endTime = addHours(new Date(`${formData.date}T${formData.startTime}`), 2)
        .toTimeString()
        .slice(0, 5);

      const scheduleData = {
        ...formData,
        endTime,
        maxTrainees: 10,
        status: 'upcoming',
      };

      await createSchedule(scheduleData).unwrap();
      toast.success('Schedule created successfully!');
      setIsDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to create schedule');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h3 className="text-3xl text-center font-bold mb-8">Class Schedule Management</h3>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h4 className="text-xl font-semibold">
            Schedules for {date ? format(date, 'MMMM d, yyyy') : 'selected date'}
          </h4>
          <p className="text-sm text-muted-foreground">
            {filteredSchedules.length} of 5 slots used today
          </p>
        </div>
        <div className="flex gap-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
          <Button
            onClick={() => setIsDialogOpen(true)}
            disabled={isMaxSchedulesReached}
          >
            {isMaxSchedulesReached ? 'Daily Limit Reached' : 'Create Schedule'}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredSchedules}
          emptyMessage="No schedules found for this date"
        />
      )}

      <ScheduleForm
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleCreateSchedule}
        trainers={trainers}
        date={date}
        isSubmitting={isCreating}
        isMaxSchedulesReached={isMaxSchedulesReached}
      />
    </div>
  );
};

export default ClassScheduleManagementPage;