import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import { Area, AreaChart, ResponsiveContainer } from "recharts"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// --- Sample data for our mini charts ---
const revenueData = [
  { value: 300 },
  { value: 450 },
  { value: 500 },
  { value: 400 },
  { value: 600 },
  { value: 750 },
  { value: 800 },
  { value: 1250 },
]

const customersData = [
  { value: 1500 },
  { value: 1400 },
  { value: 1600 },
  { value: 1700 },
  { value: 1450 },
  { value: 1300 },
  { value: 1234 },
]

const usersData = [
  { value: 30000 },
  { value: 32000 },
  { value: 35000 },
  { value: 38000 },
  { value: 40000 },
  { value: 42000 },
  { value: 45678 },
]

const growthData = [
  { value: 2.1 },
  { value: 2.5 },
  { value: 3.0 },
  { value: 2.8 },
  { value: 3.5 },
  { value: 4.0 },
  { value: 4.5 },
]

const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#26a772';
const destructiveColor = getComputedStyle(document.documentElement).getPropertyValue('--destructive').trim() || '#e7000b';

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Card 1: Total Revenue */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            $1,250.00
          </CardTitle>
          <CardAction>
            <Badge variant="default">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="h-20 p-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={revenueData}
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={primaryColor}
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor={primaryColor}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                strokeWidth={2}
                stroke={primaryColor}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Card 2: New Customers */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>New Customers</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            1,234
          </CardTitle>
          <CardAction>
            <Badge variant="destructive">
              <IconTrendingDown />
              -20%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="h-20 p-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={customersData}
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorCustomers" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={destructiveColor}
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor={destructiveColor}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                strokeWidth={2}
                stroke={destructiveColor}
                fill="url(#colorCustomers)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Card 3: Total Users */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Users</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            45,678
          </CardTitle>
          <CardAction>
            <Badge variant="default">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="h-20 p-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={usersData}
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={primaryColor}
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor={primaryColor}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                strokeWidth={2}
                stroke={primaryColor}
                fill="url(#colorUsers)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Card 4: Growth Rate */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Growth Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            4.5%
          </CardTitle>
          <CardAction>
            <Badge variant="default">
              <IconTrendingUp />
              +4.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="h-20 p-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={growthData}
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={primaryColor}
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor={primaryColor}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                strokeWidth={2}
                stroke={primaryColor}
                fill="url(#colorGrowth)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}