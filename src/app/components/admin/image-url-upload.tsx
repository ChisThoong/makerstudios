"use client";

import { ChangeEvent, useRef, useState } from "react";
import { Upload, X } from "lucide-react";

type ImageUrlUploadProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  uploadLabel?: string;
  previewAlt?: string;
  previewClassName?: string;
  required?: boolean;
  disabled?: boolean;
};

export default function ImageUrlUpload({
  value,
  onChange,
  label,
  placeholder = "Enter image URL...",
  uploadLabel = "Upload Image",
  previewAlt = "Image preview",
  previewClassName = "h-48 object-cover",
  required,
  disabled,
}: ImageUrlUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const uploadFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const form = new FormData();
      form.append("file", file);

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: form,
      });

      const data = (await response.json()) as { success?: boolean; url?: string; message?: string };

      if (!response.ok || !data.url) {
        throw new Error(data.message || "Upload failed");
      }

      onChange(data.url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to upload image");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-bold text-gray-900 mb-4">
          {label}
        </label>
      )}

      {value ? (
        <div className="relative group">
          <img
            src={value}
            alt={previewAlt}
            className={`w-full rounded-lg bg-gray-50 ${previewClassName}`}
          />
          <button
          type="button"
          onClick={() => onChange("")}
          disabled={disabled}
          className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity disabled:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : null}

      <div className={value ? "mt-3" : ""}>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm mb-2"
          placeholder={placeholder}
          value={value}
          required={required}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
        />

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={uploadFile}
        />

        <button
          type="button"
          disabled={uploading || disabled}
          onClick={() => inputRef.current?.click()}
          className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Upload className="w-5 h-5" />
          <span className="text-sm font-medium">
            {uploading ? "Uploading..." : uploadLabel}
          </span>
        </button>

        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      </div>
    </div>
  );
}
