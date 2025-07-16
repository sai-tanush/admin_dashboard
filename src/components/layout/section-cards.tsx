import { useEffect } from "react";
import { gsap } from "gsap";
import {
  TbTrendingDown,
  TbTrendingUp,
} from "react-icons/tb";
import {
  FaDollarSign,
  FaUserPlus,
  FaUsers,
  FaChartLine,
} from "react-icons/fa";
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
        {/* ... (defs, XAxis, Tooltip, Area - no changes here) ... */}
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.4} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="date"
          scale="point"
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
  // Initial number animation (unchanged)
  useEffect(() => {
    const numberElements = gsap.utils.toArray<HTMLElement>(".animated-number");
    const tweens: gsap.core.Tween[] = [];
    numberElements.forEach((el) => {
      const targetValue = parseFloat(el.dataset.value || "0");
      const formatType = el.dataset.format;
      const counter = { value: 0 };
      const tween = gsap.to(counter, {
        value: targetValue,
        duration: 1.5,
        ease: "power2.out",
        onUpdate: () => {
          if (formatType === "currency") {
            el.innerText = `$${counter.value.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`;
          } else if (formatType === "percent") {
            el.innerText = `${counter.value.toFixed(1)}%`;
          } else {
            el.innerText = Math.round(counter.value).toLocaleString("en-US");
          }
        },
      });
      tweens.push(tween);
    });
    return () => {
      tweens.forEach((tween) => tween.kill());
    };
  }, []);

  // --- UPDATED HOVER ANIMATION FOR BADGE NUMBERS ---
  const handleCardHover = (event: React.MouseEvent<HTMLDivElement>) => {
    // Find the badge and the specific text span inside the hovered card
    const badge = event.currentTarget.querySelector<HTMLElement>(".animated-badge");
    const badgeTextElement = badge?.querySelector<HTMLElement>(".animated-badge-text");

    // Ensure we found the elements and the data-value attribute exists
    if (badge && badgeTextElement && badge.dataset.value) {
      const targetValue = parseFloat(badge.dataset.value);
      
      // Use a proxy object for the animation, starting from 0 each time
      const counter = { value: 0 };

      // Animate the counter object from 0 to the target value
      gsap.fromTo(
        counter,
        { value: 0 },
        {
          value: targetValue,
          duration: 0.5, // A quick, satisfying animation
          ease: "power2.out",
          onUpdate: () => {
            // Determine the correct sign to show
            const sign = counter.value > 0 ? "+" : "";

            // Check if the original target was an integer or float to format correctly
            const displayValue = Math.abs(targetValue % 1) > 0
                ? counter.value.toFixed(1) // Keep one decimal for floats
                : counter.value.toFixed(0); // No decimals for integers

            // Update the text content on every frame of the animation
            badgeTextElement.innerText = `${sign}${displayValue}%`;
          },
        }
      );
    }
  };

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* --- Card 1: Revenue --- */}
      <Card
        className="@container/card hover:scale-[1.03] transition-transform"
        onMouseEnter={handleCardHover}
      >
        <CardHeader>
          <CardDescription className="flex items-center gap-2 text-muted-foreground">
            <FaDollarSign className="text-muted-foreground" />
            Total Revenue
          </CardDescription>
          <CardTitle
            className="animated-number text-2xl font-semibold tabular-nums @[250px]/card:text-3xl"
            data-value="1250.00"
            data-format="currency"
          >
            $0.00
          </CardTitle>
          <CardAction>
            {/* Add data-value to Badge and a span with a class to the text */}
            <Badge variant="default" className="animated-badge" data-value="12.5">
              <TbTrendingUp />
              <span className="animated-badge-text">+12.5%</span>
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="h-20 p-0">
          {renderChart(revenueData, primaryColor, "colorRevenue")}
        </CardContent>
      </Card>

      {/* --- Card 2: New Customers --- */}
      <Card
        className="@container/card hover:scale-[1.03] transition-transform"
        onMouseEnter={handleCardHover}
      >
        <CardHeader>
          <CardDescription className="flex items-center gap-2 text-muted-foreground">
            <FaUserPlus className="text-muted-foreground" />
            New Customers
          </CardDescription>
          <CardTitle
            className="animated-number text-2xl font-semibold tabular-nums @[250px]/card:text-3xl"
            data-value="1234"
            data-format="integer"
          >
            0
          </CardTitle>
          <CardAction>
            <Badge variant="destructive" className="animated-badge" data-value="-20">
              <TbTrendingDown />
              <span className="animated-badge-text">-20%</span>
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="h-20 p-0">
          {renderChart(customersData, destructiveColor, "colorCustomers")}
        </CardContent>
      </Card>

      {/* --- Card 3: Total Users --- */}
      <Card
        className="@container/card hover:scale-[1.03] transition-transform"
        onMouseEnter={handleCardHover}
      >
        <CardHeader>
          <CardDescription className="flex items-center gap-2 text-muted-foreground">
            <FaUsers className="text-muted-foreground" />
            Total Users
          </CardDescription>
          <CardTitle
            className="animated-number text-2xl font-semibold tabular-nums @[250px]/card:text-3xl"
            data-value="45678"
            data-format="integer"
          >
            0
          </CardTitle>
          <CardAction>
            <Badge variant="default" className="animated-badge" data-value="12.5">
              <TbTrendingUp />
              <span className="animated-badge-text">+12.5%</span>
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="h-20 p-0">
          {renderChart(usersData, primaryColor, "colorUsers")}
        </CardContent>
      </Card>

      {/* --- Card 4: Growth Rate --- */}
      <Card
        className="@container/card hover:scale-[1.03] transition-transform"
        onMouseEnter={handleCardHover}
      >
        <CardHeader>
          <CardDescription className="flex items-center gap-2 text-muted-foreground">
            <FaChartLine className="text-muted-foreground" />
            Growth Rate
          </CardDescription>
          <CardTitle
            className="animated-number text-2xl font-semibold tabular-nums @[250px]/card:text-3xl"
            data-value="4.5"
            data-format="percent"
          >
            0.0%
          </CardTitle>
          <CardAction>
            <Badge variant="default" className="animated-badge" data-value="4.5">
              <TbTrendingUp />
              <span className="animated-badge-text">+4.5%</span>
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