import type { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { ArrowUpDown } from "lucide-react";

import { type Product } from "@/features/product";
import Actions from "./Actions";

export const createProductColumns = (
  onSelectProductId: (productId: string) => void
): ColumnDef<Product>[] => [
  {
    accessorKey: "title",
    header: "產品名稱",
    cell: ({ row }) => (
      <div className="text-amber-900">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "origin_price",
    header: () => <div className="text-right">原價</div>,
    cell: ({ row }) => {
      const originPrice = row.getValue("origin_price") as number;
      return (
        <div className="text-right text-amber-600">
          <del>NT$ {new Intl.NumberFormat().format(originPrice)}</del>
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            售價
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const price = row.getValue("price") as number;
      return (
        <div className="text-right text-red-700 font-semibold">
          NT$ {new Intl.NumberFormat().format(price)}
        </div>
      );
    },
  },
  {
    accessorKey: "is_enabled",
    header: () => <div className="text-center">狀態</div>,
    cell: ({ row }) => {
      const isEnabled = row.getValue("is_enabled") as number;
      return (
        <div className="text-center">
          <Badge
            variant="secondary"
            className={
              isEnabled === 1
                ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }
          >
            {isEnabled === 1 ? "啟用" : "未啟用"}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">操作</div>,
    cell: ({ row }) => {
      const product = row.original;
      return (
        <Actions productId={product.id} onSelectProductId={onSelectProductId} />
      );
    },
  },
];
