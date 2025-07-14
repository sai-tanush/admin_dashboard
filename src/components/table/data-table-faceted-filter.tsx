import * as React from "react"
// --- CHANGED: Added and removed icons ---
import { TbChevronDown } from "react-icons/tb";
import { type Column } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
// --- CHANGED: Removed Command and Popover, Added DropdownMenu ---
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Props definition remains the same
interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>
  title?: string
  options: {
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
  }[]
}

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
}: DataTableFacetedFilterProps<TData, TValue>) {
  // Logic to get selected values remains the same
  const selectedValues = new Set(column?.getFilterValue() as string[])

  return (
    // --- CHANGED: Replaced Popover with DropdownMenu ---
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* --- CHANGED: Simplified the Button UI --- */}
        <Button variant="outline" size="sm" className="h-8">
          {title}
          {/* A cleaner way to show selected count */}
          {selectedValues?.size > 0 && (
            <>
              <DropdownMenuSeparator className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal"
              >
                {selectedValues.size}
              </Badge>
            </>
          )}
          {/* --- CHANGED: Added the requested down arrow icon --- */}
          <TbChevronDown className="ml-2 size-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      {/* --- CHANGED: Replaced PopoverContent with DropdownMenuContent --- */}
      <DropdownMenuContent className="w-56" align="start">
        {/* --- NEW: Added a label for better context --- */}
        <DropdownMenuLabel>{title}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* --- CHANGED: Replaced Command components with DropdownMenuCheckboxItem --- */}
        {options.map((option) => {
          const isSelected = selectedValues.has(option.value)
          return (
            <DropdownMenuCheckboxItem
              key={option.value}
              checked={isSelected}
              onCheckedChange={(checked) => {
                // Logic is similar, but adapted for the new component
                const newSelectedValues = new Set(selectedValues)
                if (checked) {
                  newSelectedValues.add(option.value)
                } else {
                  newSelectedValues.delete(option.value)
                }
                const filterValues = Array.from(newSelectedValues)
                column?.setFilterValue(
                  filterValues.length ? filterValues : undefined
                )
              }}
            >
              {option.icon && (
                <option.icon className="mr-2 size-4 text-muted-foreground" />
              )}
              <span>{option.label}</span>
            </DropdownMenuCheckboxItem>
          )
        })}

        {/* --- CHANGED: A clearer way to add the "Clear" functionality --- */}
        {selectedValues.size > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
                onSelect={() => column?.setFilterValue(undefined)}
                className="justify-center text-center text-red-500"
            >
                Clear filters
            </DropdownMenuCheckboxItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}