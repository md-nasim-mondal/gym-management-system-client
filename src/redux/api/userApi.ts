import type { IAuthResponse, IProfileUpdateData, IUserRoleUpdateData, IUsersResponse } from "@/types";
import { baseApi } from "./baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all users (admin only)
    getAllUsers: builder.query<IUsersResponse, void>({
      query: () => "/users/all-users",
      providesTags: ["User"],
    }),

    // Get all trainers
    getTrainers: builder.query<IUsersResponse, void>({
      query: () => "/users/trainers",
      providesTags: ["User"],
    }),

    // Update user profile
    updateProfile: builder.mutation<IAuthResponse, IProfileUpdateData>({
      query: (profileData) => ({
        url: `/users/${profileData.userId}`,
        method: "PATCH",
        body: profileData,
      }),
      invalidatesTags: ["Auth", "User"],
    }),

    // Update user role (admin only)
    updateUserRole: builder.mutation<
      IAuthResponse,
      { userId: string; data: IUserRoleUpdateData }
    >({
      query: ({ userId, data }) => ({
        url: `/users/${userId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetTrainersQuery,
  useUpdateProfileMutation,
  useUpdateUserRoleMutation,
} = userApi;