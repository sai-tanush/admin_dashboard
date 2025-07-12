import {
  TbTrendingDown,
  TbTrendingUp,
} from "react-icons/tb";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ChartData = { date: string; value: number };

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const suffix =
    day === 1 || day === 21 || day === 31
      ? "st"
      : day === 2 || day === 22
      ? "nd"
      : day === 3 || day === 23
      ? "rd"
      : "th";
  return `${day}${suffix} ${month}`;
}

const revenueData = [
  { date: "2025-05-25", value: 300 },
  { date: "2025-06-01", value: 450 },
  { date: "2025-06-08", value: 500 },
  { date: "2025-06-15", value: 400 },
  { date: "2025-06-22", value: 600 },
  { date: "2025-06-29", value: 750 },
  { date: "2025-07-06", value: 800 },
  { date: "2025-07-13", value: 1250 },
];

const customersData = [
  { date: "2025-05-25", value: 1500 },
  { date: "2025-06-01", value: 1400 },
  { date: "2025-06-08", value: 1600 },
  { date: "2025-06-15", value: 1700 },
  { date: "2025-06-22", value: 1450 },
  { date: "2025-06-29", value: 1300 },
  { date: "2025-07-06", value: 1234 },
];

const usersData = [
  { date: "2025-05-25", value: 30000 },
  { date: "2025-06-01", value: 32000 },
  { date: "2025-06-08", value: 35000 },
  { date: "2025-06-15", value: 38000 },
  { date: "2025-06-22", value: 40000 },
  { date: "2025-06-29", value: 42000 },
  { date: "2025-07-06", value: 45678 },
];

const growthData = [
  { date: "2025-05-25", value: 2.1 },
  { date: "2025-06-01", value: 2.5 },
  { date: "2025-06-08", value: 3.0 },
  { date: "2025-06-15", value: 2.8 },
  { date: "2025-06-22", value: 3.5 },
  { date: "2025-06-29", value: 4.0 },
  { date: "2025-07-06", value: 4.5 },
];

const primaryColor =
  getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#26a772';
const destructiveColor =
  getComputedStyle(document.documentElement).getPropertyValue('--destructive').trim() || '#e7000b';

function renderChart(data: ChartData[], color: string, gradientId: string) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ left: 16, right: 16 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.4} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="date"
          scale="band"
          fontSize={10}
          tickLine={false}
          axisLine={false}
          tickFormatter={formatDate}
        />
        <Tooltip
          labelFormatter={(date) => `Week of ${formatDate(date)}`}
          contentStyle={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
            fontSize: "0.75rem",
          }}
          cursor={{ fill: "var(--muted)" }}
        />
        <Area
          type="monotone"
          dataKey="value"
          strokeWidth={2}
          stroke={color}
          fill={`url(#${gradientId})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            $1,250.00
          </CardTitle>
          <CardAction>
            <Badge variant="default">
              <TbTrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="h-20 p-0">
          {renderChart(revenueData, primaryColor, "colorRevenue")}
        </CardContent>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>New Customers</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            1,234
          </CardTitle>
          <CardAction>
            <Badge variant="destructive">
              <TbTrendingDown />
              -20%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="h-20 p-0">
          {renderChart(customersData, destructiveColor, "colorCustomers")}
        </CardContent>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Users</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            45,678
          </CardTitle>
          <CardAction>
            <Badge variant="default">
              <TbTrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="h-20 p-0">
          {renderChart(usersData, primaryColor, "colorUsers")}
        </CardContent>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Growth Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            4.5%
          </CardTitle>
          <CardAction>
            <Badge variant="default">
              <TbTrendingUp />
              +4.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="h-20 p-0">
          {renderChart(growthData, primaryColor, "colorGrowth")}
        </CardContent>
      </Card>
    </div>
  );
}
