import { useTranslations } from "next-intl";

import loader from "@/assets/loader.gif";
import AppImage from "@/components/ui/app-image";

const Loading = () => {
  const t = useTranslations("Loading");

  return (
    <div>
      <AppImage
        src={loader}
        alt={t("message")}
        height={40}
        width={40}
        preload
        containerClassName="h-screen w-screen"
      />
    </div>
  );
};

export default Loading;
