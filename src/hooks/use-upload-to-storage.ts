import { api } from "@/trpc/react";

export const useUploadToStorage = () => {
  const { mutateAsync: presignUpload } = api.page.presignUpload.useMutation();
  const { mutateAsync: confirmUpload } = api.page.confirmUpload.useMutation();

  return {
    mutate: async (file: File) => {
      const { presignedUrl, fileKey } = await presignUpload({
        fileName: file.name,
        fileSize: file.size,
      });

      await fetch(presignedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      return await confirmUpload({ fileKey });
    },
  };
};
