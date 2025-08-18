import { Progress } from "@/components/ui/progress";

interface ProgressItem {
  name: string;
  value: number;
  color?: string;
}

export function ProgressChart({ items }: { items: ProgressItem[] }) {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="space-y-1">
          <div className="flex justify-between">
            <span className="text-sm font-medium">{item.name}</span>
            <span className="text-sm text-muted-foreground">{item.value}%</span>
          </div>
          <Progress value={item.value} className="h-2" />
        </div>
      ))}
    </div>
  );
}