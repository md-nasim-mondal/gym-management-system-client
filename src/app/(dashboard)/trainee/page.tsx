/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchMyBookings } from '@/redux/features/booking/bookingSlice';
import { fetchSchedules } from '@/redux/features/schedule/scheduleSlice';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { ProgressChart } from '@/components/dashboard/ProgressChart';

const TraineeDashboard = () => {
  const dispatch = useAppDispatch();
  const { bookings } = useAppSelector((state) => state.booking);
  const { schedules } = useAppSelector((state) => state.schedule);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [availableSchedules, setAvailableSchedules] = useState<any[]>([]);

  useEffect(() => {
    dispatch(fetchMyBookings());
    dispatch(fetchSchedules());
  }, [dispatch]);

  useEffect(() => {
    if (date && schedules.length > 0) {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const filtered = schedules.filter((schedule) => {
        const scheduleDate = new Date(schedule.date);
        return format(scheduleDate, 'yyyy-MM-dd') === formattedDate;
      });
      setAvailableSchedules(filtered);
    }
  }, [date, schedules]);

  const confirmedBookings = bookings.filter(
    (booking) => booking.status === 'confirmed'
  );
  const cancelledBookings = bookings.filter(
    (booking) => booking.status === 'cancelled'
  );
  const completedBookings = bookings.filter(
    (booking) => booking.status === 'completed'
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Trainee Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatsCard
          title="Upcoming Classes" 
          value={confirmedBookings.length.toString()}
          icon="calendar" 
          trend="up" 
        />
        <StatsCard 
          title="Completed Classes" 
          value={completedBookings.length.toString()} 

          icon="check-circle" 
          trend="up" 
        />
        <StatsCard 
          title="Cancelled Classes" 
          value={cancelledBookings.length.toString()} 

          icon="x-circle" 
          trend="down" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-4 col-span-1">
          <h2 className="text-xl font-semibold mb-4">Class Calendar</h2>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </Card>

        <Card className="p-4 col-span-1 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Available Classes for {date && format(date, 'MMMM d, yyyy')}</h2>
          {availableSchedules.length > 0 ? (
            <div className="space-y-4">
              {availableSchedules.map((schedule) => (
                <div key={schedule._id} className="border rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{schedule.classType}</h3>
                    <p className="text-sm text-gray-500">
                      {schedule.startTime} - {schedule.endTime}
                    </p>
                    <p className="text-sm">Trainer: {schedule.trainer.name}</p>
                    <p className="text-sm">
                      {schedule.trainees.length}/{schedule.maxTrainees} spots filled
                    </p>
                  </div>
                  <Button variant="outline">
                    Book Class
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No classes available for this date.</p>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          {/* <RecentActivity activities={bookings.slice(0, 5).map(booking => ({
            id: booking._id,
            title: `${booking.status === 'confirmed' ? 'Booked' : booking.status === 'cancelled' ? 'Cancelled' : 'Completed'} ${booking.schedule.classType}`,
            time: new Date(booking.bookedAt).toLocaleDateString(),
            status: booking.status,
            user: booking.trainee.name,
            action: booking.status === 'confirmed' ? 'booked' : booking.status === 'cancelled' ? 'cancelled' : 'completed'
            id: booking._id,
            title: `${booking.status === 'confirmed' ? 'Booked' : booking.status === 'cancelled' ? 'Cancelled' : 'Completed'} ${booking.schedule.classType}`,
            time: new Date(booking.bookedAt).toLocaleDateString(),
            status: booking.status
          }))} /> */}
        </Card>
        
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Progress</h2>
          <ProgressChart 
            items={[
              { name: 'Completed', value: completedBookings.length },
              { name: 'Upcoming', value: confirmedBookings.length },
              { name: 'Cancelled', value: cancelledBookings.length },
            ]} 
          />
        </Card>
      </div>
    </div>
  );
};

export default TraineeDashboard;