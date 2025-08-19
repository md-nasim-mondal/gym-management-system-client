import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// কুকি রিডিং ইউটিলিটি ফাংশন (এনকোডেড ভ্যালু হ্যান্ডেল করে)
const getCookie = (name: string): string | null => {
  if (typeof window === "undefined") return null;

  const cookiePair = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));

  if (!cookiePair) return null;

  const cookieValue = cookiePair.split("=")[1];
  return decodeURIComponent(cookieValue);
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1`
      : "http://localhost:8000/api/v1",
    credentials: "include",
  }),

  // ট্যাগ টাইপস (ডেটা রিফেচের জন্য)
  tagTypes: ["Auth", "User", "Schedule", "Booking"],

  // কমন এন্ডপয়েন্টস এখানে এক্সটেন্ড করতে পারেন
  endpoints: () => ({}),
});
