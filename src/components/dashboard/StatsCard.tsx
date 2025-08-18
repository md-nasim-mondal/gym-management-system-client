import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

interface StatsCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  change?: string;
  trend?: "up" | "down";
}

export function StatsCard({ title, value, icon, change, trend }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && trend && (
          <Badge
            variant={trend === "up" ? "default" : "destructive"}
            className="mt-2"
          >
            {change} {trend === "up" ? "↑" : "↓"}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}