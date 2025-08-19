/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState } from 'react';
import { baseApi } from '@/redux/api/baseApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';

// Define the schedule API
const scheduleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSchedules: builder.query({
      query: () => '/schedules',
      providesTags: ['Schedule'],
    }),
    createSchedule: builder.mutation({
      query: (data) => ({
        url: '/schedules',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Schedule'],
    }),
    getTrainers: builder.query({
      query: () => '/users?role=trainer',
      providesTags: ['User'],
    }),
  }),
});

const { useGetSchedulesQuery, useCreateScheduleMutation, useGetTrainersQuery } = scheduleApi;

const ScheduleManagementPage = () => {
  const { data: schedulesData, isLoading } = useGetSchedulesQuery(undefined);
  const { data: trainersData } = useGetTrainersQuery(undefined);
  const [createSchedule, { isLoading: isCreating }] = useCreateScheduleMutation();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    trainer: '',
    maxTrainees: 10,
    classType: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'maxTrainees' ? parseInt(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createSchedule(formData).unwrap();
      toast.success('Schedule created successfully');
      setIsModalOpen(false);
      setFormData({
        date: '',
        startTime: '',
        endTime: '',
        trainer: '',
        maxTrainees: 10,
        classType: '',
      });
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to create schedule');
    }
  };

  if (isLoading) return <div className="p-4">Loading schedules...</div>;

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Schedule Management</CardTitle>
          <Button onClick={() => setIsModalOpen(true)}>Create New Schedule</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Trainer</TableHead>
                <TableHead>Class Type</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedulesData?.data.map((schedule: any) => (
                <TableRow key={schedule._id}>
                  <TableCell>{new Date(schedule.date).toLocaleDateString()}</TableCell>
                  <TableCell>{`${schedule.startTime} - ${schedule.endTime}`}</TableCell>
                  <TableCell>{schedule.trainer.name}</TableCell>
                  <TableCell>{schedule.classType}</TableCell>
                  <TableCell>{`${schedule.trainees.length}/${schedule.maxTrainees}`}</TableCell>
                  <TableCell>{schedule.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {isModalOpen && (
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Schedule</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date" className="text-right">Date</Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="startTime" className="text-right">Start Time</Label>
                    <Input
                      id="startTime"
                      name="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={handleInputChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="endTime" className="text-right">End Time</Label>
                    <Input
                      id="endTime"
                      name="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={handleInputChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="trainer" className="text-right">Trainer</Label>
                    <Select
                      name="trainer"
                      value={formData.trainer}
                      onValueChange={(value: any) => setFormData({...formData, trainer: value})}
                      required
                    >
                      <option value="">Select Trainer</option>
                      {trainersData?.data.map((trainer: any) => (
                        <option key={trainer._id} value={trainer._id}>
                          {trainer.name}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="classType" className="text-right">Class Type</Label>
                    <Input
                      id="classType"
                      name="classType"
                      value={formData.classType}
                      onChange={handleInputChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="maxTrainees" className="text-right">Max Trainees</Label>
                    <Input
                      id="maxTrainees"
                      name="maxTrainees"
                      type="number"
                      min="1"
                      max="10"
                      value={formData.maxTrainees}
                      onChange={handleInputChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isCreating}>
                      {isCreating ? 'Creating...' : 'Create Schedule'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ScheduleManagementPage;