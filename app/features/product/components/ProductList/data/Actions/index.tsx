import { Button } from "@/components/ui/button";

import { InfoIcon } from "lucide-react";

import ProductDeleteButton from "@/features/product/components/ProductDeleteButton";
import ProductFormDialog from "@/features/product/components/ProductFormDialog";

type ActionsPropType = {
  productId: string;
  onSelectProductId: (productId: string) => void;
};

export default function Actions(props: ActionsPropType) {
  const { productId, onSelectProductId } = props;

  return (
    <div className="text-center flex justify-center items-center gap-1">
      <ProductFormDialog productId={productId} />

      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 hover:bg-amber-100 hover:text-amber-900 text-amber-700"
        onClick={() => onSelectProductId(productId)}
      >
        <InfoIcon className="h-4 w-4" />
      </Button>

      <ProductDeleteButton productId={productId} />
    </div>
  );
}
