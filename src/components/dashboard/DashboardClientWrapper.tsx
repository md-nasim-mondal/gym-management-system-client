"use client";

import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default function DashboardClientWrapper({
  children,
  userFromServer,
}: Readonly<{
  children: React.ReactNode;
  userFromServer?: {
    id: string;
    name: string;
    email: string;
    role: string;
    image?: string;
  };
}>) {
  const { user: userFromRedux, isLoading } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Use the user from server if available, otherwise use Redux
  const user = userFromServer || userFromRedux;

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
      </div>
    );
  }

  return (
    <div className='flex h-screen bg-gray-100'>
      {/* Sidebar */}
      <Sidebar
        user={user}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      {/* Main Content */}
      <div className='flex-1 overflow-auto'>
        {/* Header */}
        <DashboardHeader user={user} />
        {/* Page Content */}
        <main className='p-6'>{children}</main>
      </div>
    </div>
  );
}