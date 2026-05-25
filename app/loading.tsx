import loader from "@/assets/loader.gif";
import AppImage from "@/components/ui/app-image";

const Loading = () => {
  return (
    <div>
      <AppImage
        src={loader}
        alt="Loading"
        height={50}
        width={50}
        preload
        className="w-50 h-50"
        containerClassName="h-screen w-screen"
      />
    </div>
  );
};

export default Loading;
