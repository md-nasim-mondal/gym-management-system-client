import { baseApi } from "./baseApi";

interface Trainer {
  _id: string;
  name: string;
}

interface Trainee {
  _id: string;
  name: string;
}

interface Schedule {
  _id?: string;
  date: string;
  startTime: string;
  endTime: string;
  trainer: Trainer;
  maxTrainees: number;
  trainees: Trainee[];
  classType: string;
  status: "upcoming" | "completed" | "cancelled";
}

interface ScheduleResponse {
  success: boolean;
  message: string;
  data: {
    schedule: Schedule;
  };
}

interface SchedulesResponse {
  success: boolean;
  message: string;
  data: {
    schedules: Schedule[];
  };
}

export const scheduleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSchedules: builder.query<SchedulesResponse, void>({
      query: () => "/schedules",
      providesTags: ["Schedule"],
    }),
    getScheduleById: builder.query<ScheduleResponse, string>({
      query: (id) => `/schedules/${id}`,
      providesTags: ["Schedule"],
    }),
    createSchedule: builder.mutation<
      ScheduleResponse,
      Omit<Schedule, "_id">
    >({
      query: (scheduleData) => ({
        url: "/schedules/create",
        method: "POST",
        body: scheduleData,
      }),
      invalidatesTags: ["Schedule"],
    }),
    updateSchedule: builder.mutation<
      ScheduleResponse,
      { id: string; data: Partial<Schedule> }
    >({
      query: ({ id, data }) => ({
        url: `/schedules/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Schedule"],
    }),
    cancelSchedule: builder.mutation<ScheduleResponse, string>({
      query: (id) => ({
        url: `/schedules/cancel/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Schedule", "Booking"],
    }),
  }),
});

export const {
  useGetSchedulesQuery,
  useGetScheduleByIdQuery,
  useCreateScheduleMutation,
  useUpdateScheduleMutation,
  useCancelScheduleMutation,
} = scheduleApi;