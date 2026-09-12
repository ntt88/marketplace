'use client';
import Image, {ImageProps} from "next/image";

type MyImageProps = ImageProps & {
  aiCrop?: boolean;
  width: number;
  height?: number;
};

const MyImage = ({aiCrop, ...props}: MyImageProps) => {
  return (
    <Image {...props} />
  );
};

export default MyImage;
