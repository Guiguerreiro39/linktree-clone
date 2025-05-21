import { ImageLoading } from "@/components/image-loading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useUploadToStorage } from "@/hooks/use-upload-to-storage";
import { Image } from "lucide-react";
import { useRef, useState } from "react";

type Props = {
  onChange: (value: string | undefined) => void;
  value?: string;
};

export const InputAvatar = ({ onChange, value }: Props) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate: uploadToStorage } = useUploadToStorage();

  return (
    <div>
      <button
        type="button"
        className="cursor-pointer"
        onClick={() => inputRef.current?.click()}
      >
        <Avatar className="h-16 w-16">
          <AvatarImage src={value} />
          <AvatarFallback>
            {uploadedFile ? (
              <ImageLoading file={uploadedFile} />
            ) : (
              /* eslint-disable-next-line jsx-a11y/alt-text */
              <Image size={25} />
            )}
          </AvatarFallback>
        </Avatar>
      </button>
      <Input
        type="file"
        className="hidden"
        ref={inputRef}
        onChange={async (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];

          if (!file) {
            return;
          }

          onChange(undefined);
          setUploadedFile(file);

          const data = await uploadToStorage(file);

          onChange(data.publicUrl);
        }}
      />
    </div>
  );
};
