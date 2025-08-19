import DashboardClientWrapper from "@/components/dashboard/DashboardClientWrapper";

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