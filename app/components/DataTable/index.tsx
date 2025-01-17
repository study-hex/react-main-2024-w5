"use client";
import { useState, useMemo } from "react";
import type {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { ChevronsUpDown } from "lucide-react";

import DataTablePagination from "../DataTablePagination";

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  title?: string;
  actions?: React.ReactNode;
};

export default function DataTable<TData, TValue>({
  columns,
  data,
  title = "資料列表",
  actions,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    autoResetPageIndex: false,
  });

  const emptyRows = useMemo(() => {
    const pageSize = table.getState().pagination.pageSize;
    const currentRows = table.getRowModel().rows.length;
    return Math.max(0, pageSize - currentRows);
  }, [table.getRowModel().rows.length, table.getState().pagination.pageSize]);

  return (
    <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3 bg-amber-100/50">
        <CardTitle className="text-amber-900 font-serif">{title}</CardTitle>
        <div className="flex items-center gap-4">
          <Input
            placeholder="搜尋標題..."
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("title")?.setFilterValue(event.target.value)
            }
            className="max-w-sm bg-white/80"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-white/80">
                <ChevronsUpDown className="h-4 w-4 mr-2" />
                顯示欄位
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          {actions}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="rounded-md">
          <div className="grid grid-rows-[auto_1fr]">
            <div className="h-[calc(100vh-14rem)] overflow-auto">
              <Table>
                <TableHeader className="bg-amber-50/50">
                  <TableRow className="h-12">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <>
                        {headerGroup.headers.map((header) => (
                          <TableHead
                            key={header.id}
                            className="px-4 text-amber-800"
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        ))}
                      </>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    <>
                      {table.getRowModel().rows.map((row) => (
                        <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() && "selected"}
                          className="h-13 hover:bg-amber-50/30"
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell
                              key={cell.id}
                              className="px-4 h-13 text-amber-900"
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                      {emptyRows > 0 &&
                        Array(emptyRows)
                          .fill(0)
                          .map((_, index) => (
                            <TableRow key={`empty-${index}`} className="h-14">
                              {columns.map((_, colIndex) => (
                                <TableCell
                                  key={`empty-cell-${colIndex}`}
                                  className="px-4 h-13"
                                >
                                  &nbsp;
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                    </>
                  ) : (
                    <TableRow className="h-24">
                      <TableCell
                        colSpan={columns.length}
                        className="text-center text-amber-800"
                      >
                        沒有資料
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </CardContent>

      <div className="p-4 bg-amber-50/50 border-t border-amber-100">
        <DataTablePagination table={table} />
      </div>
    </Card>
  );
}
