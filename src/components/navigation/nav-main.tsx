import { TbCirclePlusFilled, TbMail } from "react-icons/tb";

import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: React.ElementType;
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            {/* "Add Warehouse" button now has an outline style */}
            <SidebarMenuButton
              tooltip="Quick Create"
              className="border border-input bg-transparent hover:bg-accent hover:text-accent-foreground min-w-8 duration-200 ease-linear cursor-pointer"
            >
              <TbCirclePlusFilled />
              <span>Add Warehouse</span>
            </SidebarMenuButton>
            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <TbMail />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                // Conditionally apply active/selected styles to "Dashboard"
                className={
                  item.title === "Dashboard"
                    ? "bg-primary text-background hover:bg-primary/90 hover:text-background/90 active:bg-primary/90 active:text-primary-foreground cursor-pointer"
                    : "cursor-pointer"
                }
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}