/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { fetchSchedules } from "@/redux/features/schedule/scheduleSlice";
import {
  bookClass,
  fetchMyBookings,
} from "@/redux/features/booking/bookingSlice";

export default function BookingPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { schedules, isLoading: scheduleLoading } = useSelector(
    (state: RootState) => state.schedule
  );
  const { bookings, isLoading: bookingLoading } = useSelector(
    (state: RootState) => state.booking
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [bookingInProgress, setBookingInProgress] = useState<string | null>(
    null
  );

  useEffect(() => {
    dispatch(fetchSchedules());
    dispatch(fetchMyBookings());
  }, [dispatch]);

  // Filter schedules for the selected date
  const filteredSchedules = schedules.filter((schedule) => {
    if (!selectedDate) return false;
    const scheduleDate = new Date(schedule.date);
    return (
      scheduleDate.getDate() === selectedDate.getDate() &&
      scheduleDate.getMonth() === selectedDate.getMonth() &&
      scheduleDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  // Check if a schedule is already booked
  const isAlreadyBooked = (scheduleId: string) => {
    return bookings.some((booking) => booking.schedule._id === scheduleId);
  };

  // Check if a schedule has time conflict with existing bookings
  const hasTimeConflict = (scheduleToCheck: any) => {
    return bookings.some((booking) => {
      // Skip cancelled bookings
      if (booking.status === "cancelled") return false;

      const bookingSchedule = booking.schedule;
      const bookingDate = new Date(bookingSchedule.date);
      const scheduleDate = new Date(scheduleToCheck.date);

      // If dates are different, no conflict
      if (
        bookingDate.getDate() !== scheduleDate.getDate() ||
        bookingDate.getMonth() !== scheduleDate.getMonth() ||
        bookingDate.getFullYear() !== scheduleDate.getFullYear()
      ) {
        return false;
      }

      // Check for time overlap
      const bookingStart = new Date(`1970-01-01T${bookingSchedule.startTime}`);
      const bookingEnd = new Date(`1970-01-01T${bookingSchedule.endTime}`);
      const scheduleStart = new Date(`1970-01-01T${scheduleToCheck.startTime}`);
      const scheduleEnd = new Date(`1970-01-01T${scheduleToCheck.endTime}`);

      return (
        (scheduleStart >= bookingStart && scheduleStart < bookingEnd) ||
        (scheduleEnd > bookingStart && scheduleEnd <= bookingEnd) ||
        (scheduleStart <= bookingStart && scheduleEnd >= bookingEnd)
      );
    });
  };

  const handleBookClass = async (scheduleId: string) => {
    setBookingInProgress(scheduleId);
    try {
      await dispatch(bookClass(scheduleId)).unwrap();
      toast.success("Class booked successfully!");
      // Refresh bookings
      dispatch(fetchMyBookings());
      // Refresh schedules to update availability
      dispatch(fetchSchedules());
    } catch (error: any) {
      toast.error(error.message || "Failed to book class");
    } finally {
      setBookingInProgress(null);
    }
  };

  return (
    <div className='container mx-auto py-6'>
      <h1 className='text-3xl font-bold mb-6'>Book a Class</h1>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='md:col-span-1'>
          <Card>
            <CardHeader>
              <CardTitle>Select Date</CardTitle>
              <CardDescription>
                Choose a date to view available classes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode='single'
                selected={selectedDate}
                onSelect={setSelectedDate}
                className='rounded-md border'
              />
            </CardContent>
          </Card>
        </div>

        <div className='md:col-span-2'>
          <Card>
            <CardHeader>
              <CardTitle>
                Available Classes for{" "}
                {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Today"}
              </CardTitle>
              <CardDescription>
                Book your spot in one of our classes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {scheduleLoading ? (
                <div className='flex justify-center items-center h-40'>
                  <Loader2 className='h-8 w-8 animate-spin text-primary' />
                </div>
              ) : filteredSchedules.length === 0 ? (
                <div className='text-center py-10'>
                  <p className='text-muted-foreground'>
                    No classes available for this date.
                  </p>
                </div>
              ) : (
                <div className='space-y-4'>
                  {filteredSchedules.map((schedule) => {
                    const isBooked = isAlreadyBooked(schedule._id);
                    const hasConflict = hasTimeConflict(schedule);
                    const isFull =
                      schedule.trainees.length >= schedule.maxTrainees;

                    return (
                      <Card key={schedule._id} className='overflow-hidden'>
                        <div className='p-6'>
                          <div className='flex justify-between items-start'>
                            <div>
                              <h3 className='text-lg font-semibold'>
                                {schedule.classType}
                              </h3>
                              <p className='text-sm text-muted-foreground'>
                                {schedule.startTime} - {schedule.endTime}
                              </p>
                              <div className='mt-2'>
                                <p className='text-sm'>
                                  <span className='font-medium'>Trainer:</span>{" "}
                                  {schedule.trainer.name}
                                </p>
                                <p className='text-sm'>
                                  <span className='font-medium'>
                                    Availability:
                                  </span>{" "}
                                  {schedule.trainees.length}/
                                  {schedule.maxTrainees} spots filled
                                </p>
                              </div>
                            </div>
                            <div>
                              {isBooked ? (
                                <Badge variant='secondary'>
                                  Already Booked
                                </Badge>
                              ) : isFull ? (
                                <Badge variant='destructive'>Class Full</Badge>
                              ) : hasConflict ? (
                                <Badge variant='outline'>Time Conflict</Badge>
                              ) : null}
                            </div>
                          </div>

                          <div className='mt-4'>
                            <Button
                              onClick={() => handleBookClass(schedule._id)}
                              disabled={
                                isBooked ||
                                isFull ||
                                hasConflict ||
                                bookingInProgress === schedule._id
                              }
                              className='w-full'>
                              {bookingInProgress === schedule._id ? (
                                <>
                                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                  Booking...
                                </>
                              ) : isBooked ? (
                                "Already Booked"
                              ) : isFull ? (
                                "Class Full"
                              ) : hasConflict ? (
                                "Time Conflict"
                              ) : (
                                "Book Class"
                              )}
                            </Button>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
