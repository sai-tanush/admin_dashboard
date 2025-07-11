import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { chartData } from "@/data/dashboard-data"

export const description = "An interactive area chart with monthly, weekly, and daily views."

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  // 1. State is updated to manage view type: monthly, weekly, or daily.
  const [timeView, setTimeView] = React.useState("monthly")

  // On mobile, default to a more granular view.
  React.useEffect(() => {
    if (isMobile) {
      setTimeView("daily")
    }
  }, [isMobile])

  // 2. Data is processed using useMemo to aggregate based on the selected timeView.
  const processedData = React.useMemo(() => {
    const data = chartData

    switch (timeView) {
      case "monthly": {
        const monthlyData: Record<string, { date: string; desktop: number; mobile: number }> = {}

        data.forEach((item) => {
          const date = new Date(item.date)
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

          if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = {
              date: new Date(date.getFullYear(), date.getMonth(), 1).toISOString(),
              desktop: 0,
              mobile: 0,
            }
          }

          monthlyData[monthKey].desktop += item.desktop
          monthlyData[monthKey].mobile += item.mobile
        })

        return Object.values(monthlyData).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      }
      case "weekly": {
        const weeklyData: Record<string, { date: string; desktop: number; mobile: number }> = {}

        data.forEach((item) => {
          const date = new Date(item.date)
          const startOfWeek = new Date(date)
          startOfWeek.setDate(date.getDate() - date.getDay())
          const weekKey = startOfWeek.toISOString().split("T")[0]

          if (!weeklyData[weekKey]) {
            weeklyData[weekKey] = {
              date: weekKey,
              desktop: 0,
              mobile: 0,
            }
          }

          weeklyData[weekKey].desktop += item.desktop
          weeklyData[weekKey].mobile += item.mobile
        })

        return Object.values(weeklyData).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      }
      case "daily": {
        // For daily view, we'll show the last 30 days to avoid clutter.
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        return data.filter((item) => new Date(item.date) > thirtyDaysAgo)
      }
      default:
        return []
    }
  }, [timeView])

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Bookings</CardTitle>
        {/* 3. Updated description to be more generic */}
        <CardDescription>
          Showing total bookings aggregated by month, week, or day.
        </CardDescription>
        <CardAction>
          {/* 4. UI controls updated with new values and labels */}
          <ToggleGroup
            type="single"
            value={timeView}
            onValueChange={setTimeView}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
            <ToggleGroupItem value="weekly">Weekly</ToggleGroupItem>
            <ToggleGroupItem value="daily">Daily</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeView} onValueChange={setTimeView}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a view"
            >
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="monthly" className="rounded-lg">
                Monthly
              </SelectItem>
              <SelectItem value="weekly" className="rounded-lg">
                Weekly
              </SelectItem>
              <SelectItem value="daily" className="rounded-lg">
                Daily
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          {/* 5. Chart now uses the dynamically processed data */}
          <AreaChart data={processedData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              // 6. X-axis formatter is now dynamic based on the view
              tickFormatter={(value) => {
                const date = new Date(value)
                if (timeView === "monthly") {
                  return date.toLocaleDateString("en-US", { month: "short" })
                }
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : processedData.length - 5} // Adjust default index
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    const date = new Date(value)
                    if (timeView === "monthly") {
                      return date.toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric"
                      })
                    }
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="mobile"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--color-desktop)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}