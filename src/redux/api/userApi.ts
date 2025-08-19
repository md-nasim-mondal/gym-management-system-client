import { baseApi } from "./baseApi";

export interface User {
  _id?: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  address?: string;
  picture?: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken?: string;
    refreshToken?: string;
  };
}

interface UsersResponse {
  success: boolean;
  message: string;
  data: User[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

interface ProfileUpdateData {
  userId: string;
  name?: string;
  phone?: string;
  address?: string;
  picture?: string;
}

interface UserRoleUpdateData {
  role: string;
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all users (admin only)
    getAllUsers: builder.query<UsersResponse, void>({
      query: () => "/users/all-users",
      providesTags: ["User"],
    }),

    // Update user profile
    updateProfile: builder.mutation<AuthResponse, ProfileUpdateData>({
      query: (profileData) => ({
        url: `/users/${profileData.userId}`,
        method: "PATCH",
        body: profileData,
      }),
      invalidatesTags: ["Auth", "User"],
    }),

    // Update user role (admin only)
    updateUserRole: builder.mutation<
      AuthResponse,
      { userId: string; data: UserRoleUpdateData }
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
  useUpdateProfileMutation,
  useUpdateUserRoleMutation,
} = userApi;
