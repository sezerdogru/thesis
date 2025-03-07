"use client";

import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

const App = () => {
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault();

    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
      });

      // Hata kontrolü
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error:", errorText);
        alert("Yükleme başarısız!");
        return;
      }

      // Yanıtı JSON olarak işleme
      const result = await response.json();
      setMessage(result.message);
    } catch (error) {
      console.error("Yükleme hatası:", error);
      alert("Yükleme sırasında bir hata oluştu!");
    }
  };

  useEffect(() => {
    // API'yi çağırarak dosyaları al
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

  console.log("API URL:", process.env.REACT_APP_API_URL);

  return (
    <div className="flex items-center justify-center h-screen">
      <input type="file" onChange={handleUpload} />
      {message && <p>{message}</p>}

      <div className="">
        <h1>Loaded images</h1>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {files.length > 0 ? (
          <ul>
            {files.map((fileUrl, index) => (
              <li key={index}>
                <Image src={fileUrl} alt={`file-${index}`} width={200} />
                <br />
                <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                  Dosyayı Görüntüle
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>There is no image.</p>
        )}
      </div>
    </div>
  );
};

export default App;
