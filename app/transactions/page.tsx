"use client";

import { useState } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowUpDown,
  Download,
  Filter,
  // Plus,
  Upload,
} from "lucide-react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import { AddTransactionDialog } from "@/components/add-transaction-dialog"

type Transaction = {
  id: string;
  date: string;
  description: string;
  category: string;
  account: string;
  amount: number;
};

const data: Transaction[] = [
  {
    id: "t1",
    date: "2025-04-02",
    description: "Grocery Store",
    category: "Food",
    account: "Checking Account",
    amount: -85.25,
  },
  {
    id: "t2",
    date: "2025-04-01",
    description: "Salary",
    category: "Income",
    account: "Checking Account",
    amount: 4750.0,
  },
  {
    id: "t3",
    date: "2025-04-01",
    description: "Electric Bill",
    category: "Utilities",
    account: "Checking Account",
    amount: -120.5,
  },
  {
    id: "t4",
    date: "2025-03-30",
    description: "Restaurant",
    category: "Food",
    account: "Credit Card",
    amount: -45.8,
  },
  {
    id: "t5",
    date: "2025-03-29",
    description: "Gas Station",
    category: "Transportation",
    account: "Credit Card",
    amount: -38.25,
  },
  {
    id: "t6",
    date: "2025-03-28",
    description: "Online Shopping",
    category: "Shopping",
    account: "Credit Card",
    amount: -65.99,
  },
  {
    id: "t7",
    date: "2025-03-27",
    description: "Coffee Shop",
    category: "Food",
    account: "Checking Account",
    amount: -4.5,
  },
  {
    id: "t8",
    date: "2025-03-25",
    description: "Mobile Phone Bill",
    category: "Utilities",
    account: "Checking Account",
    amount: -85.0,
  },
  {
    id: "t9",
    date: "2025-03-24",
    description: "Gym Membership",
    category: "Health & Fitness",
    account: "Credit Card",
    amount: -50.0,
  },
  {
    id: "t10",
    date: "2025-03-20",
    description: "Interest Payment",
    category: "Income",
    account: "Savings Account",
    amount: 12.5,
  },
];

export default function TransactionsPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  // const [showAddTransaction, setShowAddTransaction] = useState(false);

  const columns: ColumnDef<Transaction>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        const date = new Date(row.getValue("date"));
        return <div>{date.toLocaleDateString()}</div>;
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => <div>{row.getValue("description")}</div>,
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => <div>{row.getValue("category")}</div>,
    },
    {
      accessorKey: "account",
      header: "Account",
      cell: ({ row }) => <div>{row.getValue("account")}</div>,
    },
    {
      accessorKey: "amount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Amount
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("amount"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);

        return (
          <div
            className={`text-right font-medium ${
              amount < 0 ? "text-red-500" : "text-green-500"
            }`}
          >
            {amount < 0 ? (
              <span className="flex items-center justify-end gap-1">
                <ArrowDownIcon className="h-3 w-3" />
                {formatted.replace("-", "")}
              </span>
            ) : (
              <span className="flex items-center justify-end gap-1">
                <ArrowUpIcon className="h-3 w-3" />
                {formatted}
              </span>
            )}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <PageLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
            <p className="text-muted-foreground">
              View and manage your transactions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>
            {/* <Button size="sm" onClick={() => setShowAddTransaction(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Transaction
            </Button> */}
          </div>
        </div>

        <Card>
          <CardHeader className="pb-1">
            <div className="flex items-center justify-between">
              <CardTitle>All Transactions</CardTitle>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Filter transactions..."
                  value={
                    (table
                      .getColumn("description")
                      ?.getFilterValue() as string) ?? ""
                  }
                  onChange={(event) =>
                    table
                      .getColumn("description")
                      ?.setFilterValue(event.target.value)
                  }
                  className="max-w-sm"
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Date</DropdownMenuItem>
                    <DropdownMenuItem>Category</DropdownMenuItem>
                    <DropdownMenuItem>Account</DropdownMenuItem>
                    <DropdownMenuItem>Amount</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Columns
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
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
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
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
                        No transactions found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
              <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected.
              </div>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* <AddTransactionDialog open={showAddTransaction} onOpenChange={setShowAddTransaction} /> */}
      </div>
    </PageLayout>
  );
}
