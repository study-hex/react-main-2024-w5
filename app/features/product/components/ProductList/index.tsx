import { type Product } from "~/features/product";

import DataTable from "../../../../components/DataTable";
import { createProductColumns } from "./data/columns";
import ProductFormDialog from "@/features/product/components/ProductFormDialog";

type ProductListPropsType = {
  products: Product[];
  onSelectProductId: (productId: string) => void;
};

export default function ProductList(props: ProductListPropsType) {
  const { products, onSelectProductId } = props;

  const columns = createProductColumns(onSelectProductId);

  return (
    <>
      <DataTable
        columns={columns}
        data={products}
        actions={<ProductFormDialog />}
      />
    </>
  );
}
