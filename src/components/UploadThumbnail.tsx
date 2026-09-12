import MyImage from "@/components/MyImage";
import {UploadedFile} from "@/libs/types";
import React from "react";

type Props = {
  file:UploadedFile;
  onClick?: () => void;
}

export default function UploadThumbnail({file,onClick}:Props) {
  function handleClick(ev:React.MouseEvent) {
    if (onClick) {
      ev.preventDefault();
      return onClick();
    }
    location.href = file.url;
  }
  if (file.fileType === 'image') {
    return (
      <a onClick={handleClick} target="_blank">
        <MyImage
          width={300}
          height={300}
          alt={'product thumbnail'}
          aiCrop={true}
          src={file.filePath}
        />
      </a>
    );
  }
  return (
    <div>{file.url} &raquo;</div>
  );
}