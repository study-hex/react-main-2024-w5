import { useState } from "react";

import ProductList from "./components/ProductList";
import ProductContent from "./components/ProductContent";

import { useProductsAll } from "~/service/product";

export type Product = {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
  content: string;
  origin_price: number;
  price: number;
  unit: string;
  imagesUrl: string[];
  is_enabled: number;
};

export type ProductsType = {
  products: Record<string, Product>;
};

export default function Product() {
  const { data, isLoading } = useProductsAll<ProductsType>();

  const [selectedProductId, setSelectedProductId] = useState("");

  const products = data?.products
    ? (Object.values(data.products) as Product[])
    : [];

  const selectedProduct =
    products.find((product) => product.id === selectedProductId) || products[0];

  const handleSelectProductId = (productId: string) => {
    setSelectedProductId(productId);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {products && products.length > 0 && (
            <>
              <div>
                <ProductList
                  products={products}
                  onSelectProductId={handleSelectProductId}
                />
              </div>
              <div>
                <ProductContent product={selectedProduct} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
