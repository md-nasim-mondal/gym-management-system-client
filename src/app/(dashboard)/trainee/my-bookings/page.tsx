/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { cancelBooking, fetchMyBookings } from '@/redux/features/bookingSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function MyBookingsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { bookings, isLoading: loading } = useSelector((state: RootState) => state.booking);
  const [cancelInProgress, setCancelInProgress] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch]);

  const handleCancelBooking = async (bookingId: string) => {
    setCancelInProgress(bookingId);
    try {
      await dispatch(cancelBooking(bookingId)).unwrap();
      toast.success('Booking cancelled successfully!');
      // Refresh bookings
      dispatch(fetchMyBookings());
    } catch (error: any) {
      toast.error(error.message || 'Failed to cancel booking');
    } finally {
      setCancelInProgress(null);
    }
  };

  // Group bookings by status
  const confirmedBookings = bookings.filter(booking => booking.status === 'confirmed');
  const completedBookings = bookings.filter(booking => booking.status === 'completed');
  const cancelledBookings = bookings.filter(booking => booking.status === 'cancelled');

  // Function to render booking card
  const renderBookingCard = (booking: any) => {
    const scheduleDate = new Date(booking.schedule.date);
    const isPastClass = scheduleDate < new Date();
    
    return (
      <Card key={booking._id} className="mb-4">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{booking.schedule.classType}</h3>
              <p className="text-sm text-muted-foreground">
                {format(scheduleDate, 'MMMM d, yyyy')} • {booking.schedule.startTime} - {booking.schedule.endTime}
              </p>
              <div className="mt-2">
                <p className="text-sm">
                  <span className="font-medium">Trainer:</span> {booking.schedule.trainer.name}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Booked on:</span> {format(new Date(booking.bookedAt), 'MMMM d, yyyy')}
                </p>
              </div>
            </div>
            <div>
              <Badge 
                variant={booking.status === 'confirmed' ? 'default' : booking.status === 'completed' ? 'secondary' : 'destructive'}
              >
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </Badge>
            </div>
          </div>
          
          {booking.status === 'confirmed' && !isPastClass && (
            <div className="mt-4">
              <Button
                variant="destructive"
                onClick={() => handleCancelBooking(booking._id)}
                disabled={cancelInProgress === booking._id}
                className="w-full"
              >
                {cancelInProgress === booking._id ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  'Cancel Booking'
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : bookings.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="text-muted-foreground mb-4">You haven&apos;t booked any classes yet.</p>
            <Button asChild>
              <a href="/trainee/booking">Book a Class</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="confirmed">
          <TabsList className="mb-6">
            <TabsTrigger value="confirmed">
              Upcoming ({confirmedBookings.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedBookings.length})
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Cancelled ({cancelledBookings.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="confirmed">
            {confirmedBookings.length === 0 ? (
              <Card>
                <CardContent className="py-10 text-center">
                  <p className="text-muted-foreground">No upcoming bookings.</p>
                </CardContent>
              </Card>
            ) : (
              confirmedBookings.map(renderBookingCard)
            )}
          </TabsContent>
          
          <TabsContent value="completed">
            {completedBookings.length === 0 ? (
              <Card>
                <CardContent className="py-10 text-center">
                  <p className="text-muted-foreground">No completed bookings.</p>
                </CardContent>
              </Card>
            ) : (
              completedBookings.map(renderBookingCard)
            )}
          </TabsContent>
          
          <TabsContent value="cancelled">
            {cancelledBookings.length === 0 ? (
              <Card>
                <CardContent className="py-10 text-center">
                  <p className="text-muted-foreground">No cancelled bookings.</p>
                </CardContent>
              </Card>
            ) : (
              cancelledBookings.map(renderBookingCard)
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}