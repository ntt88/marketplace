'use client';
import {UploadedFile} from "@/libs/types";
import {ChangeEvent} from "react";

type Props = {
  onUploadStart?: () => void;
  onSuccess: (file: UploadedFile) => void;
  onError?: (error: unknown) => void;
};

export default function Uploader({onUploadStart, onSuccess, onError}: Props) {
  async function handleChange(ev: ChangeEvent<HTMLInputElement>) {
    const file = ev.target.files?.[0];
    ev.target.value = '';
    if (!file) {
      return;
    }
    onUploadStart?.();
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/upload', {method: 'POST', body: formData});
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      const uploadedFile: UploadedFile = await response.json();
      onSuccess(uploadedFile);
    } catch (err) {
      onError?.(err);
    }
  }

  return (
    <input type="file" accept="image/*" onChange={handleChange} />
  );
}
