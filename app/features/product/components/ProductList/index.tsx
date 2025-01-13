import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { InfoIcon } from "lucide-react";

import { type Product } from "~/features/product";
import ProductDeleteButton from "../ProductDeleteButton";
import ProductFormDialog from "../ProductFormDialog";

type ProductListPropsType = {
  products: Product[];
  onSelectProductId: (productId: string) => void;
};

export default function ProductList(props: ProductListPropsType) {
  const { products, onSelectProductId } = props;

  return (
    <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between py-3 bg-amber-100/50">
        <CardTitle className="text-amber-900 font-serif">產品列表</CardTitle>
        <ProductFormDialog />
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-amber-50/50">
            <TableRow>
              <TableHead className="px-4 text-amber-800">產品名稱</TableHead>
              <TableHead className="text-right text-amber-800">原價</TableHead>
              <TableHead className="text-right text-amber-800">售價</TableHead>
              <TableHead className="text-center text-amber-800">狀態</TableHead>
              <TableHead className="text-center text-amber-800">操作</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {products.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="px-4 text-amber-900">
                  {item.title}
                </TableCell>
                <TableCell className="text-right text-amber-600">
                  <del>
                    NT$ {new Intl.NumberFormat().format(item.origin_price)}
                  </del>
                </TableCell>
                <TableCell className="text-right text-red-700 font-semibold">
                  NT$ {new Intl.NumberFormat().format(item.price)}
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant="secondary"
                    className={
                      item.is_enabled === 1
                        ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }
                  >
                    {item.is_enabled === 1 ? "啟用" : "未啟用"}
                  </Badge>
                </TableCell>

                <TableCell className="text-center flex justify-center items-center gap-1">
                  <ProductFormDialog productId={item.id} />

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-amber-100 hover:text-amber-900 text-amber-700"
                    onClick={() => onSelectProductId(item.id)}
                  >
                    <InfoIcon className="h-4 w-4" />
                  </Button>

                  <ProductDeleteButton productId={item.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
