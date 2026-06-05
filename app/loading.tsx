import loader from "@/assets/loader.gif";
import AppImage from "@/components/ui/app-image";

const Loading = () => {
  return (
    <div>
      <AppImage
        src={loader}
        alt="Loading"
        height={40}
        width={40}
        preload
        containerClassName="h-screen w-screen"
      />
    </div>
  );
};

export default Loading;
