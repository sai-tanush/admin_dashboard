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
  const [timeView, setTimeView] = React.useState("monthly")

  React.useEffect(() => {
    if (isMobile) {
      setTimeView("daily")
    }
  }, [isMobile])

  const processedData = React.useMemo(() => {
    // ... (no changes in this block)
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
        <CardDescription>
          Showing total bookings aggregated by month, week, or day.
        </CardDescription>
        <CardAction>
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
              <SelectItem value="monthly" className="rounded-lg">Monthly</SelectItem>
              <SelectItem value="weekly" className="rounded-lg">Weekly</SelectItem>
              <SelectItem value="daily" className="rounded-lg">Daily</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>

      {/* CHANGE 1: Enable horizontal scrolling on the chart's parent */}
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6 overflow-x-auto">
        <ChartContainer
          config={chartConfig}
          // CHANGE 2: Give the chart a minimum width so it can overflow
          className="aspect-auto h-[250px] min-w-[600px]"
        >
          <AreaChart data={processedData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-desktop)" stopOpacity={1.0} />
                <stop offset="95%" stopColor="var(--color-desktop)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-mobile)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-mobile)" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
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
              defaultIndex={isMobile ? -1 : processedData.length - 5}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    if (typeof value !== "string" && typeof value !== "number") return null
                    const date = new Date(value)
                    if (timeView === "monthly") {
                      return date.toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })
                    }
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
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