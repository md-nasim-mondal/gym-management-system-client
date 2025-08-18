import DashboardClientWrapper from "@/components/dashboard/DashboardClientWrapper";
import { getCurrentUser } from "@/redux/features/auth/authSlice";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <DashboardClientWrapper >
      {children}
    </DashboardClientWrapper>
  );
}