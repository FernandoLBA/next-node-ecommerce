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
    <p className={cn("text-2xl", className)}>
      <span className="text-xs align-super">$</span>
      {int}
      <span className="text-xs align-super">{decimal}</span>
    </p>
  );
};

export default ProductPrice;
