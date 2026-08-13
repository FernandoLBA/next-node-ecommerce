import { Button } from "@/components/ui/button";
import LoaderIcon from "@/components/ui/loader-icon";

type MarkingButtonProps = {
  isPending: boolean;
  action: () => Promise<void>;
  text: "paid" | "delivered";
};

const MarkingButton = ({
  isPending,
  action,
  text: markAs,
}: MarkingButtonProps) => {
  const buttonText = `Mark as ${markAs}`;

  return (
    <Button className="w-full" disabled={isPending} onClick={action}>
      {isPending && <LoaderIcon className="w-4 h-4" />}
      {isPending ? "Processing..." : buttonText}
    </Button>
  );
};

export default MarkingButton;
