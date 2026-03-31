'use client';
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useAppDispatch } from "../../../../../redux/store/hook";
import { uploadDocument } from "../../../../../redux/medicine/medicineThunks"; // adjust path

interface DropzoneProps {
  accept: Record<string, string[]>;
  onDrop?: (files: File[]) => void;
  multiple?: boolean;
  onFileUploadSuccess?: (url: string) => void;
  folder?: string;
}

const DropzoneComponent: React.FC<DropzoneProps> = ({
  accept,
  onDrop,
  multiple,
  onFileUploadSuccess,
  folder = "misc",
}) => {
  const dispatch = useAppDispatch();

  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const handleDrop = async (acceptedFiles: File[]) => {
    if (onDrop) onDrop(acceptedFiles);

    if (acceptedFiles.length === 0) {
      setError("Please select a file first.");
      return;
    }

    const selectedFile = acceptedFiles[0];

    try {
      setUploadProgress(30); // fake start (since thunk doesn't expose progress)

      const url = await dispatch(
        uploadDocument({
          folder,
          file: selectedFile,
        })
      ).unwrap();

      setUploadProgress(100);
      setError(null);

      if (onFileUploadSuccess) {
        onFileUploadSuccess(url);
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err || "Failed to upload image.");
      setUploadProgress(0);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept,
    multiple: multiple ?? true,
  });

  return (
    <>
      <div className="transition border border-gray-300 border-dashed cursor-pointer rounded-xl hover:border-blue-500 bg-gray-50">
        <div
          {...getRootProps()}
          className={`rounded-xl p-7 lg:p-10 border-dashed transition-colors ${
            isDragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 bg-gray-50"
          }`}
        >
          <input {...getInputProps()} />

          <div className="flex flex-col items-center">
            <h4 className="mb-3 font-semibold text-gray-800 text-lg">
              {isDragActive ? "Drop Files Here" : "Drag & Drop Files Here"}
            </h4>

            <span className="text-center mb-5 text-sm text-gray-600">
              Drag and drop your files here or browse
            </span>

            <span className="font-medium underline text-sm text-blue-600">
              Browse File
            </span>
          </div>
        </div>
      </div>

      {/* Progress */}
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="mt-3">
          <p className="text-sm text-gray-700">
            Uploading: {uploadProgress}%
          </p>
          <div className="w-full h-3 bg-gray-200 rounded-md mt-2">
            <div
              className="h-full bg-green-500 rounded-md transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-red-600 text-sm mt-3">Error: {error}</p>
      )}
    </>
  );
};

export default DropzoneComponent;