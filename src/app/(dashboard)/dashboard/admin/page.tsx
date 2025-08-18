import { Button } from "@/components/ui/button";
import { Users, Calendar, DollarSign, Activity } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { ProgressChart } from "@/components/dashboard/ProgressChart";

export default function AdminDashboard() {
  const stats = [
    {
      title: "Total Members",
      value: "1,234",
      icon: <Users className='h-4 w-4' />,
      change: "+12%",
      trend: "up",
    },
    {
      title: "Active Now",
      value: "84",
      icon: <Activity className='h-4 w-4' />,
      change: "+5%",
      trend: "up",
    },
    {
      title: "Classes Today",
      value: "12",
      icon: <Calendar className='h-4 w-4' />,
      change: "-2%",
      trend: "down",
    },
    {
      title: "Revenue",
      value: "$24,560",
      icon: <DollarSign className='h-4 w-4' />,
      change: "+18%",
      trend: "up",
    },
  ];

  const activities = [
    {
      user: "Sarah Johnson",
      action: "joined the gym",
      time: "10 minutes ago",
      avatar: "",
    },
    {
      user: "Mike Peterson",
      action: "purchased a membership",
      time: "1 hour ago",
      avatar: "",
    },
    {
      user: "Trainer Alex",
      action: "added a new class",
      time: "2 hours ago",
      avatar: "",
    },
  ];

  const progressItems = [
    { name: "Membership Renewals", value: 75 },
    { name: "Class Attendance", value: 82 },
    { name: "Revenue Growth", value: 64 },
  ];

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-bold'>Admin Dashboard</h1>
        <Button>Generate Report</Button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            {...stat}
            trend={stat.trend as "up" | "down"}
          />
        ))}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2'>
          <RecentActivity activities={activities} />
        </div>

        <div className='space-y-6'>
          <div className='space-y-2'>
            <h2 className='text-xl font-semibold'>Quick Actions</h2>
            <div className='grid gap-2'>
              <Button variant='outline' className='w-full'>
                Add New Member
              </Button>
              <Button variant='outline' className='w-full'>
                Schedule Class
              </Button>
              <Button variant='outline' className='w-full'>
                View Payments
              </Button>
              <Button variant='outline' className='w-full'>
                Manage Trainers
              </Button>
            </div>
          </div>

          <div className='space-y-2'>
            <h2 className='text-xl font-semibold'>Progress Metrics</h2>
            <ProgressChart items={progressItems} />
          </div>
        </div>
      </div>
    </div>
  );
}
