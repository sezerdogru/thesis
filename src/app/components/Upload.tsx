"use client";

import useUploadHook from "@/hooks/useUploadHook";

const Upload = () => {
  const { handleChange, handleUpload, selectedFile, message } = useUploadHook();

  return (
    <div className="mb-20 flex lg:justify-center items-center flex-col">
      <div className="mb-2">
        <input type="file" onChange={handleChange} accept="image/*" />
        <button
          className={`px-4 py-2 rounded-md ${
            selectedFile
              ? "bg-blue-500 hover:bg-blue-600 text-white"
              : "bg-gray-400 text-gray-700 cursor-not-allowed"
          }`}
          onClick={selectedFile ? handleUpload : () => null}
        >
          Upload
        </button>
      </div>

      {message && <p>{message}</p>}
    </div>
  );
};

export default Upload;
