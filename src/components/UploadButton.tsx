import React, { useRef } from 'react';
import { Button } from './Button';

type Props = {
  onFile?: (f: File) => void;
  onFiles?: (files: File[]) => void;
  multiple?: boolean;
};

export function UploadButton({ onFile, onFiles, multiple = false }: Props) {
  const ref = useRef<HTMLInputElement | null>(null);

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        ref={ref}
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          if (files.length === 0) return;
          if (multiple && onFiles) onFiles(files);
          else if (!multiple && onFile) onFile(files[0]);
          else if (onFiles) onFiles(files);
          // reset so same file(s) can be selected again
          e.currentTarget.value = '';
        }}
      />
      <Button
        variant="accent"
        size="md"
        onClick={() => ref.current?.click()}
      >
        رفع صورة جديدة
      </Button>
    </div>
  );
}

export default UploadButton;
