import type { ImageProps } from "next/image";
import Image from "next/image";

export const Logo = ({
  ...props
}: Pick<ImageProps, "height" | "width" | "className">) => {
  return <Image {...props} src="/logo.svg" alt="Logo" />;
};
