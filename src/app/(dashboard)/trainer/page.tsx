import { Button } from "@/components/ui/button";
import { Calendar, Users, Dumbbell, Clock } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ProgressChart } from "@/components/dashboard/ProgressChart";
import { Badge } from "@/components/ui/badge";

export default function TrainerDashboard() {
  const stats = [
    { title: "Upcoming Sessions", value: "5", icon: <Calendar className="h-4 w-4" /> },
    { title: "Active Clients", value: "12", icon: <Users className="h-4 w-4" /> },
    { title: "Workouts Created", value: "24", icon: <Dumbbell className="h-4 w-4" /> },
    { title: "Hours This Week", value: "18", icon: <Clock className="h-4 w-4" /> },
  ];

  const progressItems = [
    { name: "Sarah Johnson", value: 75, goal: "Weight Loss" },
    { name: "Mike Peterson", value: 60, goal: "Muscle Gain" },
    { name: "Emma Wilson", value: 90, goal: "Endurance" },
  ];

  const upcomingSessions = [
    { time: "08:00 AM", client: "Sarah Johnson", type: "Personal Training", status: "confirmed" },
    { time: "10:30 AM", client: "Mike Peterson", type: "Strength Training", status: "confirmed" },
    { time: "04:00 PM", client: "Group Class", type: "HIIT", status: "pending" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Trainer Dashboard</h1>
        <Button>Create Workout</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold">Today&apos;s Schedule</h2>
          <div className="space-y-4">
            {upcomingSessions.map((session, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="bg-primary/10 p-3 rounded-full">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{session.time}</p>
                  <p className="text-sm text-muted-foreground">{session.client}</p>
                </div>
                <div className="text-sm text-muted-foreground">{session.type}</div>
                <Badge
                  variant={
                    session.status === "confirmed" ? "default" : "secondary"
                  }
                >
                  {session.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Client Progress</h2>
          <ProgressChart
            items={progressItems.map((item) => ({
              name: item.name,
              value: item.value,
            }))}
          />
          <div className="space-y-2">
            {progressItems.map((item, index) => (
              <div key={index} className="text-sm">
                <p className="font-medium">{item.name}</p>
                <p className="text-muted-foreground">{item.goal}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}