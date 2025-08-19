import { baseApi } from "./baseApi";

interface Schedule {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  trainer: {
    _id: string;
    name: string;
  };
  classType: string;
}

interface Booking {
  _id: string;
  schedule: Schedule;
  trainee: string;
  bookedAt: string;
  status: "confirmed" | "cancelled" | "completed";
}

interface BookingResponse {
  success: boolean;
  message: string;
  data: {
    booking: Booking;
  };
}

interface BookingsResponse {
  success: boolean;
  message: string;
  data: {
    bookings: Booking[];
  };
}

export const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyBookings: builder.query<BookingsResponse, void>({
      query: () => "/bookings/my-bookings",
      providesTags: ["Booking"],
    }),
    getAllBookings: builder.query<BookingsResponse, void>({
      query: () => "/bookings",
      providesTags: ["Booking"],
    }),
    bookClass: builder.mutation<BookingResponse, string>({
      query: (scheduleId) => ({
        url: "/bookings/book",
        method: "POST",
        body: { scheduleId },
      }),
      invalidatesTags: ["Booking", "Schedule"],
    }),
    cancelBooking: builder.mutation<BookingResponse, string>({
      query: (bookingId) => ({
        url: `/bookings/cancel/${bookingId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Booking", "Schedule"],
    }),
  }),
});

export const {
  useGetMyBookingsQuery,
  useGetAllBookingsQuery,
  useBookClassMutation,
  useCancelBookingMutation,
} = bookingApi;
