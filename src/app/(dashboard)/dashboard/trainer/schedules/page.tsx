/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { baseApi } from '@/redux/api/baseApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAppSelector } from '@/redux/hooks';

// Define the trainer schedule API
const trainerScheduleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTrainerSchedules: builder.query({
      query: () => '/schedules/trainer',
      providesTags: ['Schedule'],
    }),
  }),
});

const { useGetTrainerSchedulesQuery } = trainerScheduleApi;

const TrainerSchedulesPage = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { data: schedules, isLoading } = useGetTrainerSchedulesQuery(undefined);

  if (!user) return <div className="p-4">Please login to view schedules</div>;
  if (isLoading) return <div className="p-4">Loading schedules...</div>;

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>My Class Schedules</CardTitle>
        </CardHeader>
        <CardContent>
          {schedules?.data.length === 0 ? (
            <p>You have no scheduled classes.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Class Type</TableHead>
                  <TableHead>Trainees</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedules?.data.map((schedule: any) => (
                  <TableRow key={schedule._id}>
                    <TableCell>{new Date(schedule.date).toLocaleDateString()}</TableCell>
                    <TableCell>{`${schedule.startTime} - ${schedule.endTime}`}</TableCell>
                    <TableCell>{schedule.classType}</TableCell>
                    <TableCell>{`${schedule.trainees.length}/${schedule.maxTrainees}`}</TableCell>
                    <TableCell>
                      <Badge
                        variant={schedule.status === 'upcoming' ? 'default' : schedule.status === 'completed' ? 'secondary' : 'destructive'
                        }
                      >
                        {schedule.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainerSchedulesPage;