import * as React from "react"
import {
  TbCamera,
  TbChartBar,
  TbLayoutDashboard,
  TbDatabase,
  TbFileAi,
  TbFileDescription,
  TbHelpCircle,
  TbInnerShadowTop,
  TbListDetails,
  TbReport,
  TbSettings,
} from "react-icons/tb";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavMain } from "@/components/navigation/nav-main"
import { NavDocuments } from "@/components/navigation/nav-documents"
import { NavSecondary } from "@/components/navigation/nav-secondary"
import { NavUser } from "@/components/navigation/nav-user"

const data = {
  user: {
    name: "John Doe",
    email: "johndoe@warebook.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: TbLayoutDashboard,
    },
    {
      title: "Lifecycle",
      url: "#",
      icon: TbListDetails,
    },
    {
      title: "Analytics",
      url: "#",
      icon: TbChartBar,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: TbCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: TbFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: TbFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: TbSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: TbHelpCircle,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: TbDatabase,
    },
    {
      name: "Reports",
      url: "#",
      icon: TbReport,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <TbInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">WareBook Inc</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
