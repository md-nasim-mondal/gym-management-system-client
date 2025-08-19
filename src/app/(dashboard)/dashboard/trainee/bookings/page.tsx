/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { baseApi } from '@/redux/api/baseApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';
import { useAppSelector } from '@/redux/hooks';

// Define the booking API
const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAvailableSchedules: builder.query({
      query: () => '/schedules/available',
      providesTags: ['Schedule'],
    }),
    getUserBookings: builder.query({
      query: () => '/bookings/user',
      providesTags: ['Booking'],
    }),
    bookSchedule: builder.mutation({
      query: (scheduleId) => ({
        url: `/bookings`,
        method: 'POST',
        body: { scheduleId },
      }),
      invalidatesTags: ['Booking', 'Schedule'],
    }),
    cancelBooking: builder.mutation({
      query: (bookingId) => ({
        url: `/bookings/${bookingId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Booking', 'Schedule'],
    }),
  }),
});

const {
  useGetAvailableSchedulesQuery,
  useGetUserBookingsQuery,
  useBookScheduleMutation,
  useCancelBookingMutation,
} = bookingApi;

const TraineeBookingsPage = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { data: availableSchedules, isLoading: isLoadingSchedules } = useGetAvailableSchedulesQuery(undefined);
  const { data: userBookings, isLoading: isLoadingBookings } = useGetUserBookingsQuery(undefined);
  const [bookSchedule, { isLoading: isBooking }] = useBookScheduleMutation();
  const [cancelBooking, { isLoading: isCancelling }] = useCancelBookingMutation();

  const handleBookSchedule = async (scheduleId: string) => {
    try {
      await bookSchedule(scheduleId).unwrap();
      toast.success('Class booked successfully');
    } catch (error: unknown) {
      toast.error((error as { data?: { message: string } })?.data?.message || 'Failed to book class');
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await cancelBooking(bookingId).unwrap();
      toast.success('Booking cancelled successfully');
    } catch (error: unknown) {
      toast.error((error as { data?: { message: string } })?.data?.message || 'Failed to cancel booking');
    }
  };

  if (!user) return <div className="p-4">Please login to view bookings</div>;
  if (isLoadingSchedules || isLoadingBookings) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>My Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {userBookings?.data.length === 0 ? (
            <p>You have no bookings yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Class Type</TableHead>
                  <TableHead>Trainer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userBookings?.data.map((booking: any) => (
                  <TableRow key={booking._id}>
                    <TableCell>{new Date(booking.schedule.date).toLocaleDateString()}</TableCell>
                    <TableCell>{`${booking.schedule.startTime} - ${booking.schedule.endTime}`}</TableCell>
                    <TableCell>{booking.schedule.classType}</TableCell>
                    <TableCell>{booking.schedule.trainer.name}</TableCell>
                    <TableCell>
                      <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCancelBooking(booking._id)}
                        disabled={isCancelling || booking.status === 'cancelled'}
                      >
                        Cancel
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Classes</CardTitle>
        </CardHeader>
        <CardContent>
          {availableSchedules?.data.length === 0 ? (
            <p>No available classes at the moment.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Class Type</TableHead>
                  <TableHead>Trainer</TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {availableSchedules?.data.map((schedule: any) => (
                  <TableRow key={schedule._id}>
                    <TableCell>{new Date(schedule.date).toLocaleDateString()}</TableCell>
                    <TableCell>{`${schedule.startTime} - ${schedule.endTime}`}</TableCell>
                    <TableCell>{schedule.classType}</TableCell>
                    <TableCell>{schedule.trainer.name}</TableCell>
                    <TableCell>{`${schedule.trainees.length}/${schedule.maxTrainees}`}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        onClick={() => handleBookSchedule(schedule._id)}
                        disabled={
                          isBooking ||
                          schedule.trainees.length >= schedule.maxTrainees ||
                          schedule.trainees.some((trainee: any) => trainee._id === user._id)
                        }
                      >
                        {schedule.trainees.some((trainee: any) => trainee._id === user._id)
                          ? 'Already Booked'
                          : 'Book Class'}
                      </Button>
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

export default TraineeBookingsPage;