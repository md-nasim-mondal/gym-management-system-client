/* eslint-disable @typescript-eslint/no-explicit-any */

export enum Role {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  TRAINER = "trainer",
  TRAINEE = "trainee",
}

export interface IAuthProvider {
  provider: "google" | "credentials";
  providerId: string;
}

export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  picture?: string;
  address?: string;
  isDeleted?: string;
  isActive?: IsActive;
  isVerified?: boolean;
  role: Role;
  auths: IAuthProvider[];
  bookings?: any[];
  trainers?: any[];
}

export interface IAuthResponse {
  success: boolean;
  message: string;
  data: {
    user: IUser;
    accessToken?: string;
    refreshToken?: string;
  };
}

export interface IUsersResponse {
  success: boolean;
  message: string;
  data: IUser[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface IProfileUpdateData {
  userId: string;
  name?: string;
  phone?: string;
  address?: string;
  picture?: string;
}

export interface IUserRoleUpdateData {
  role: string;
}



export interface ITrainer {
  _id?: string;
  name: string;
}

export interface ITrainee {
  _id?: string;
  name: string;
}


export interface ISchedule {
  _id?: string;
  date: string;
  startTime: string;
  endTime: string;
  trainer: ITrainer;
  maxTrainees: number;
  trainees: ITrainee[];
  classType: string;
  status: "upcoming" | "completed" | "cancelled";
}
