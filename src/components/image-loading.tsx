import { LoaderCircle } from "lucide-react";
import Image from "next/image";

type Props = {
  file: File;
};

export const ImageLoading = ({ file }: Props) => {
  return (
    <div className="relative h-full w-full">
      <Image
        src={URL.createObjectURL(file)}
        alt={file.name}
        fill
        className="object-cover blur-xs"
      />
      <LoaderCircle
        className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 animate-spin text-white"
        size={25}
      />
    </div>
  );
};
