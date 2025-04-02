import { useState } from "react";

const useUploadHook = () => {
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files?.[0] || null);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();

      formData.append("file", selectedFile);

      try {
        const res = await fetch("/api/get-presigned-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: selectedFile.name,
            fileType: selectedFile.type,
          }),
        });

        // Error check
        if (!res.ok) throw new Error("URL alınamadı");
        const { url }: { url: string } = await res.json();

        // Yanıtı JSON olarak işleme
        await fetch(url, {
          method: "PUT",
          body: selectedFile,
          headers: { "Content-Type": selectedFile.type },
        }); 
        setSelectedFile(null);
        setMessage("Success");

        window.location.reload();
      } catch (error: unknown) {
        //setMessage(error);
        console.error("Uploading failed:", error); 
      }
    }
  };

  return { handleChange, handleUpload, message, selectedFile };
};

export default useUploadHook;
