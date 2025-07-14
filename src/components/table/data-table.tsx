import * as React from "react"
import gsap from "gsap"
import {
  TbArrowDown,
  TbArrowUp,
  TbArrowsSort,
  TbX,
  TbChevronDown,
  TbChevronLeft,
  TbChevronRight,
  TbChevronsLeft,
  TbChevronsRight,
  TbLayoutColumns,
} from "react-icons/tb";

import {
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
} from "@/components/ui/tabs"
import { DataTableFacetedFilter } from "@/components/table/data-table-faceted-filter"
import { schema } from "@/data/schema"

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Helper component for sortable headers (unchanged)
function SortableHeader<TData, TValue>({
  column,
  children,
}: {
  column: Column<TData, TValue>
  children: React.ReactNode
}) {
  const sort = column.getIsSorted()
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(sort === "asc")}
    >
      {children}
      {sort === "desc" ? (
        <TbArrowDown className="ml-2 size-4" />
      ) : sort === "asc" ? (
        <TbArrowUp className="ml-2 size-4" />
      ) : (
        <TbArrowsSort className="ml-2 size-4" />
      )}
    </Button>
  )
}

// Table columns definition (unchanged)
const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => row.original.username,
    filterFn: (row, id, value) => {
      const username = (row.getValue(id) as string).toLowerCase().trim();
      const filterValue = (value as string).toLowerCase().trim();
      return username.includes(filterValue);
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => <SortableHeader column={column}>Date</SortableHeader>,
    cell: ({ row }) => {
      const formatted = new Date(row.original.date).toLocaleDateString()
      return formatted
    },
  },
  {
    accessorKey: "warehouse_name",
    header: "Warehouse",
    cell: ({ row }) => row.original.warehouse_name,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => (
      <div className="text-right font-medium">{row.original.amount}</div>
    ),
    filterFn: (row, id, value) => {
      const amount = parseFloat(row.getValue(id))
      const [min, max] = value
      if (min && amount < min) return false
      if (max && amount > max) return false
      return true
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="text-right">Status</div>,
    cell: ({ row }) => {
      const statusMap = {
        Done: { label: "Paid", variant: "default" as const },
        "In Process": { label: "Pending", variant: "warning" as const },
        "Not Started": { label: "Failed", variant: "destructive" as const },
      }
      const { label, variant } = statusMap[row.original.status]
      return (
        <div className="text-right">
          <Badge variant={variant} className="inline-flex items-center text-sm">
            {label}
          </Badge>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
]

const statusOptions = [
  { value: "Done", label: "Paid" },
  { value: "In Process", label: "Pending" },
  { value: "Not Started", label: "Failed" },
]

export function DataTable({
  data: initialData,
}: {
  data: z.infer<typeof schema>[]
}) {
  const [data] = React.useState(() => initialData)
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const [amountError, setAmountError] = React.useState({ min: false, max: false });
  const [pageInputError, setPageInputError] = React.useState(false);

  const [pageInputValue, setPageInputValue] = React.useState(
    (pagination.pageIndex + 1).toString()
  );
  const debouncedPageInput = useDebounce(pageInputValue, 500);

  React.useEffect(() => {
    const amountFilter = columnFilters.find((f) => f.id === "amount")
    const [min, max] = (amountFilter?.value as [number?, number?]) || [undefined, undefined];
    
    const updateAmountSort = (newSortRule: SortingState[0] | null) => {
      setSorting(prevSorting => {
        const otherSorts = prevSorting.filter(s => s.id !== 'amount');
        return newSortRule ? [newSortRule, ...otherSorts] : otherSorts;
      });
    };

    if (min !== undefined && !Number.isNaN(min)) {
      updateAmountSort({ id: 'amount', desc: false });
    }
    else if (max !== undefined && !Number.isNaN(max)) {
      updateAmountSort({ id: 'amount', desc: true });
    }
    else {
      updateAmountSort(null);
    }
    
  }, [columnFilters]); 

  const table = useReactTable({
    data,
    columns,
    // Prevent the table from jumping to page 1 on sort/filter
    autoResetPageIndex: false,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })
  
  // Effect to clear a column's filter when it's hidden
  React.useEffect(() => {
    const filterableColumns = ['username', 'status', 'warehouse_name', 'amount'];
    filterableColumns.forEach(colId => {
      const column = table.getColumn(colId);
      if (column && !column.getIsVisible() && column.getFilterValue() !== undefined) {
        column.setFilterValue(undefined);
      }
    });
  }, [columnVisibility, table]);

  // Effect to navigate when the debounced value changes
  React.useEffect(() => {
    if (debouncedPageInput === "") {
        setPageInputError(false);
        return;
    }
    const page = Number(debouncedPageInput);
    const pageCount = table.getPageCount();

    if (!isNaN(page) && page > 0 && page <= pageCount) {
        table.setPageIndex(page - 1);
        setPageInputError(false);
    } else {
        setPageInputError(true);
    }
  }, [debouncedPageInput, table]);

  // Effect to sync input when pagination changes from buttons
  React.useEffect(() => {
    setPageInputValue((pagination.pageIndex + 1).toString());
    setPageInputError(false);
  }, [pagination.pageIndex]);

  // Handle blur event to reset invalid page input
  const handlePageInputBlur = () => {
    const page = Number(pageInputValue);
    const pageCount = table.getPageCount();

    if (isNaN(page) || page < 1 || page > pageCount) {
      setPageInputValue((pagination.pageIndex + 1).toString());
      setPageInputError(false);
    }
  };

  const warehouseOptions = React.useMemo(() => {
    const unique = [...new Set(initialData.map((d) => d.warehouse_name))]
    return unique.map((w) => ({ value: w, label: w }))
  }, [initialData])

  const isFiltered = table.getState().columnFilters.length > 0

  const tbodyRef = React.useRef<HTMLTableSectionElement>(null);

  const tableRows = table.getRowModel().rows;

  React.useLayoutEffect(() => {
    if (!tbodyRef.current) return
    const rows = tbodyRef.current.querySelectorAll("tr")
    gsap.fromTo(
      rows,
      { autoAlpha: 0, y: 10 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.05,
        ease: "power2.out",
      }
    )
  }, [tableRows])

  return (
    <Tabs defaultValue="outline" className="w-full flex-col justify-start gap-6 mt-4">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div className="px-2">
          <p className="text-2xl">Recent Transactions</p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <TbLayoutColumns />
                <span className="hidden lg:inline">Columns</span>
                <span className="lg:hidden">Columns</span>
                <TbChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id === "warehouse_name" ? "Warehouse" : column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <TabsContent
        value="outline"
        className="relative flex flex-col gap-4 -mt-2 md:-mt-4 overflow-auto px-4 py-2 lg:px-6"
      >
        <div className="flex flex-wrap items-center gap-2">
          {table.getColumn("username")?.getIsVisible() && (
            <Input
              placeholder="Filter by username..."
              value={
                (table.getColumn("username")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("username")?.setFilterValue(event.target.value)
              }
              className="h-8 w-[150px] lg:w-[250px] bg-muted"
            />
          )}
          {table.getColumn("status")?.getIsVisible() && (
            <DataTableFacetedFilter
              column={table.getColumn("status")}
              title="Status"
              options={statusOptions}
            />
          )}
          {table.getColumn("warehouse_name")?.getIsVisible() && (
            <DataTableFacetedFilter
              column={table.getColumn("warehouse_name")}
              title="Warehouse"
              options={warehouseOptions}
            />
          )}
          {table.getColumn("amount")?.getIsVisible() && (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Min amount"
                title={amountError.min ? "Amount cannot be negative" : ""}
                className={cn(
                  "h-8 w-32 bg-muted",
                  amountError.min && "ring-2 ring-destructive focus-visible:ring-destructive"
                )}
                value={
                  (
                    table.getColumn("amount")?.getFilterValue() as [
                      number,
                      number,
                    ]
                  )?.[0] ?? ""
                }
                onChange={(e) => {
                  const value = e.target.value;
                  const numValue = Number(value);
                  if (numValue < 0) {
                    setAmountError(prev => ({ ...prev, min: true }));
                    return;
                  }
                  setAmountError(prev => ({ ...prev, min: false }));
                  const currentFilter = table
                    .getColumn("amount")
                    ?.getFilterValue() as [number, number] | undefined
                  table
                    .getColumn("amount")
                    ?.setFilterValue([
                      value ? numValue : undefined,
                      currentFilter?.[1],
                    ])
                }}
              />
              <Input
                type="number"
                placeholder="Max amount"
                title={amountError.max ? "Amount cannot be negative" : ""}
                className={cn(
                  "h-8 w-32 bg-muted",
                  amountError.max && "ring-2 ring-destructive focus-visible:ring-destructive"
                )}
                value={
                  (
                    table.getColumn("amount")?.getFilterValue() as [
                      number,
                      number,
                    ]
                  )?.[1] ?? ""
                }
                onChange={(e) => {
                  const value = e.target.value
                  const numValue = Number(value)
                  if (numValue < 0) {
                      setAmountError(prev => ({ ...prev, max: true }));
                      return;
                  }
                  setAmountError(prev => ({ ...prev, max: false }));
                  const currentFilter = table
                    .getColumn("amount")
                    ?.getFilterValue() as [number, number] | undefined
                  table
                    .getColumn("amount")
                    ?.setFilterValue([
                      currentFilter?.[0],
                      value ? numValue : undefined,
                    ])
                }}
              />
            </div>
          )}

          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => table.resetColumnFilters()}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <TbX className="ml-2 size-4" />
            </Button>
          )}
        </div>
        <div className="overflow-hidden rounded-lg border min-h-[400px] md:min-h-[500px]">
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody ref={tbodyRef}>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between px-4">
          {/* <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div> */}
          <div className="flex w-full items-center gap-4 lg:w-fit lg:gap-8">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value))
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2 text-sm font-medium">
              Page
              <Input
                type="number"
                value={pageInputValue}
                onChange={(e) => setPageInputValue(e.target.value)}
                onBlur={handlePageInputBlur}
                title={pageInputError ? `Enter a page from 1 to ${table.getPageCount()}` : ""}
                className={cn(
                  "h-8 w-16",
                  pageInputError && "ring-2 ring-destructive focus-visible:ring-destructive"
                )}
              />
              of {table.getPageCount() || 1}
            </div>
            
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <TbChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <TbChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <TbChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <TbChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}