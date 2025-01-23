import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { type Product } from "~/features/product";

type ProductContentPropsType = {
  product: Product;
};

export default function ProductContent(props: ProductContentPropsType) {
  const { product } = props;

  return (
    <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
      <CardHeader className="bg-amber-100/50">
        <CardTitle className="text-amber-900 font-serif">產品細節</CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        {product ? (
          <>
            <div className="relative mb-4">
              <img
                src={product.imageUrl}
                className="w-full h-64 object-cover rounded-md"
                alt={product.title}
              />
              <Badge className="absolute top-2 right-2 bg-amber-100 text-amber-800 hover:bg-amber-200">
                {product.category}
              </Badge>
            </div>

            <h3 className="text-xl font-semibold mb-3 text-amber-900">
              {product.title}
            </h3>

            <div className="mb-4">
              <h4 className="text-sm font-semibold mb-2 text-amber-800">
                商品描述
              </h4>
              <p className="text-amber-700">{product.description}</p>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-semibold mb-2 text-amber-800">
                商品規格
              </h4>
              <p className="text-amber-700">{product.content}</p>
            </div>

            <div className="flex items-center mb-4">
              <del className="text-amber-400 mr-2">
                NT$ {product.origin_price}
              </del>
              <span className="text-xl font-semibold text-red-700">
                NT$ {product.price}
              </span>
              <small className="text-amber-600 ml-2">/ {product.unit}</small>
            </div>

            {product.notes && (
              <div className="mb-4">
                <h5 className="text-sm font-semibold mb-2 text-amber-800">
                  備註
                </h5>
                <p className="text-amber-700">{product.notes}</p>
              </div>
            )}

            {product.imagesUrl?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-3 text-amber-800 hidden">
                  更多圖片
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {product.imagesUrl.map((url) =>
                    url ? (
                      <div key={url}>
                        <img
                          src={url}
                          className="w-full h-32 object-cover rounded-md"
                          alt="商品圖片"
                        />
                      </div>
                    ) : null
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 text-amber-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto h-12 w-12 mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <p className="text-amber-700">請選擇商品以查看詳細資訊</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
