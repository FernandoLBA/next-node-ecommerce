import { Button } from "@/components/ui/button";
import LoaderIcon from "@/components/ui/loader-icon";

type MarkAsDeliveredButtonProps = {
  isPending: boolean;
  action: () => Promise<void>;
};

const MarkAsDeliveredButton = ({
  action,
  isPending,
}: MarkAsDeliveredButtonProps) => {
  return (
    <Button className="w-full" disabled={isPending} onClick={action}>
      {isPending && <LoaderIcon className="w-4 h-4" />}
      {isPending ? "Processing..." : "Mark as Delivered"}
    </Button>
  );
};

export default MarkAsDeliveredButton;
