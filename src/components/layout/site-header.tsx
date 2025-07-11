import { Search } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function SiteHeader() {
  return (
    <header className="flex h-[var(--header-height)] bg-white shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-[var(--header-height)] lg:px-6">
      {/* Left side: Sidebar Trigger and Title */}
      <div className="flex items-center">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 hidden data-[orientation=vertical]:h-6 sm:block"
        />
        <h1 className="hidden text-lg font-semibold sm:block">Dashboard</h1>
      </div>

      {/* Right side: Search and User Avatar */}
      <div className="ml-auto flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full rounded-lg bg-background pl-8"
          />
        </div>

        {/* User Avatar with Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9 border-2 border-gray-600">
                {/* You can add an <AvatarImage /> if you have a user picture URL */}
                {/* <AvatarImage src="/avatars/01.png" alt="@username" /> */}
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">John Doe</p>
                <p className="text-xs leading-none text-muted-foreground">
                  johndoe@example.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}