import { DEFAULT_CURRENCY_SYMBOL } from "@/lib/constants";
import { cn } from "@/lib/utils";

const ProductPrice = ({
  value,
  className,
}: {
  value: number;
  className?: string;
}) => {
  const [int, decimal] = value.toString().split(".");
  return (
    <p className={cn("text-lg md:text-2xl", className)}>
      <span className="text-xs align-super">{DEFAULT_CURRENCY_SYMBOL}</span>
      {int}
      <span className="text-xs align-super">{decimal}</span>
    </p>
  );
};

export default ProductPrice;
