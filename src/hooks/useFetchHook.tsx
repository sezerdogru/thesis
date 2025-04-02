import axios from "axios";
import { useEffect, useState } from "react";

const useFetchHook = () => {
  const [files, setFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get(
          `https://sezer-be.vercel.app/get-uploaded-images`
        );
        setFiles(response.data.files);
        setLoading(false);
      } catch (error: unknown) {
        if (error instanceof Error)
          setError(`Dosyalar alınırken hata oluştu: ${error.message}`);
        else setError("Dosyalar alınırken hata oluştu");
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  useEffect(() => {
    console.log("Updated files after upload:", files);
  }, [files]);

  return { files, error, loading };
};

export default useFetchHook;
