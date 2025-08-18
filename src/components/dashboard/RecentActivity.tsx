import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ActivityItem {
  user: string;
  action: string;
  time: string;
  avatar?: string;
}

export function RecentActivity({
  activities,
}: {
  activities: ActivityItem[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center gap-4">
            <Avatar className="h-9 w-9">
              <AvatarImage src={activity.avatar} alt={activity.user} />
              <AvatarFallback>
                {activity.user
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium leading-none">
                {activity.user} {activity.action}
              </p>
              <p className="text-sm text-muted-foreground">{activity.time}</p>
            </div>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}