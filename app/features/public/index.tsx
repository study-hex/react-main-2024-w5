import { useState } from "react";

import LinearProgress from "~/components/LinearProgress";

import { useProductsAll } from "~/service/product/public";

import { type ProductsType, type Product } from "~/features/product";
import ProductDetailDialog from "../product/components/ProductDetailDialog";

export default function Public() {
  const { data, isLoading } = useProductsAll<ProductsType>();

  const [selectedProductId, setSelectedProductId] = useState<string>("");

  const products = data?.products
    ? (Object.values(data.products) as Product[])
    : [];

  if (isLoading) {
    return <LinearProgress variant="indeterminate" />;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data &&
          products?.map((product) => (
            <div
              key={product.id}
              className="group cursor-pointer"
              onClick={() => setSelectedProductId(product.id)}
            >
              <div className="aspect-square overflow-hidden rounded-2xl bg-gray-100 transition-transform duration-300 group-hover:scale-95">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="mt-4 space-y-1 px-2">
                <h3 className="text-lg font-medium">{product.title}</h3>
                <p className="text-gray-500">
                  NT$ {new Intl.NumberFormat().format(product.price)}
                </p>
              </div>
            </div>
          ))}
      </div>

      {selectedProductId && (
        <ProductDetailDialog
          productId={selectedProductId}
          open={selectedProductId !== ""}
          handleOpenChange={() => setSelectedProductId("")}
        />
      )}
    </>
  );
}
