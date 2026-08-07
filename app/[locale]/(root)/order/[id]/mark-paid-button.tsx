import { Button } from "@/components/ui/button";
import LoaderIcon from "@/components/ui/loader-icon";

type MarkAsPaidButtonProps = {
  isPending: boolean;
  action: () => Promise<void>;
};

const MarkAsPaidButton = ({ isPending, action }: MarkAsPaidButtonProps) => {
  return (
    <Button className="w-full" disabled={isPending} onClick={action}>
      {isPending && <LoaderIcon className="w-4 h-4" />}
      {isPending ? "Processing..." : "Mark as Paid"}
    </Button>
  );
};

export default MarkAsPaidButton;
