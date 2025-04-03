import { ImageProp } from "@/app/api/images/route";
import { useEffect, useState } from "react";

const useFetchHook = () => {
  const [images, setImages] = useState<ImageProp[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch(`/api/images`);
        const data: { images: ImageProp[] } = await response.json();
        setImages(data.images);
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
    console.log("Updated files after upload:", images);
  }, [images]);

  return { images, error, loading };
};

export default useFetchHook;
