import { ArrowDownLeft, ArrowUpRight, RefreshCw, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const activities = [
  {
    id: 1,
    type: "buy",
    description: "Purchased HDFC Mid-Cap Opportunities Fund",
    amount: 50000,
    date: "2024-01-15",
    icon: ArrowDownLeft,
  },
  {
    id: 2,
    type: "dividend",
    description: "Dividend received from Reliance Industries",
    amount: 2500,
    date: "2024-01-12",
    icon: ArrowUpRight,
  },
  {
    id: 3,
    type: "sip",
    description: "SIP executed - Axis Small Cap Fund",
    amount: 10000,
    date: "2024-01-10",
    icon: RefreshCw,
  },
  {
    id: 4,
    type: "maturity",
    description: "FD Maturity - ICICI Bank",
    amount: 107000,
    date: "2024-01-08",
    icon: Calendar,
  },
  {
    id: 5,
    type: "buy",
    description: "Purchased Infosys Ltd shares",
    amount: 25000,
    date: "2024-01-05",
    icon: ArrowDownLeft,
  },
];

const typeColors: Record<string, string> = {
  buy: "bg-primary/10 text-primary",
  dividend: "bg-success/10 text-success",
  sip: "bg-secondary/10 text-secondary-foreground",
  maturity: "bg-warning/10 text-warning-foreground",
};

export function RecentActivity() {
  return (
    <Card className="border-0 shadow-card animate-slide-up opacity-0 stagger-4">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="group flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50"
            >
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg",
                  typeColors[activity.type]
                )}
              >
                <activity.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground line-clamp-1">
                  {activity.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(activity.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <p
                className={cn(
                  "text-sm font-semibold",
                  activity.type === "dividend" || activity.type === "maturity"
                    ? "text-success"
                    : "text-foreground"
                )}
              >
                {activity.type === "dividend" || activity.type === "maturity"
                  ? "+"
                  : "-"}
                ₹{activity.amount.toLocaleString("en-IN")}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
