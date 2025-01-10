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

type ProductListPropsType = {
  products: Product[];
  onSelectProductId: (productId: string) => void;
};

export default function ProductList(props: ProductListPropsType) {
  const { products, onSelectProductId } = props;

  return (
    <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
      <CardHeader className="bg-amber-100/50">
        <CardTitle className="text-amber-900 font-serif">產品列表</CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-amber-50/50">
            <TableRow>
              <TableHead className="px-4 text-amber-800">產品名稱</TableHead>
              <TableHead className="text-center text-amber-800">原價</TableHead>
              <TableHead className="text-center text-amber-800">售價</TableHead>
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
                <TableCell className="text-center text-amber-600">
                  <del>NT$ {item.origin_price}</del>
                </TableCell>
                <TableCell className="text-center text-red-700 font-semibold">
                  NT$ {item.price}
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

                <TableCell className="text-center flex justify-center items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full bg-amber-700 text-amber-50 hover:bg-amber-800 border-0"
                    onClick={() => onSelectProductId(item.id)}
                  >
                    <InfoIcon className="w-4 h-4" />
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
