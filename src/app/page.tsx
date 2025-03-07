"use client";

import axios from "axios";
import { useEffect, useState } from "react";

const App = () => {
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault();

    const file = event.target.files[0];
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
        alert("Yükleme başarısız!"); // Kendi hata mesajınızı gösterin
        return;
      }

      // Yanıtı JSON olarak işleme
      const result = await response.json();
      console.log(result); // Başarılı işlem sonrası yanıt
    } catch (error) {
      console.error("Yükleme hatası:", error);
      alert("Yükleme sırasında bir hata oluştu!");
    }
    // setMessage(result.message);
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
      } catch (error) {
        setError("Dosyalar alınırken hata oluştu");
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

      <div className="flesx ">
        <h1>Yüklenmiş Dosyalar</h1>
        {loading && <p>Yükleniyor...</p>}
        {error && <p>{error}</p>}
        {files.length > 0 ? (
          <ul>
            {files.map((fileUrl, index) => (
              <li key={index}>
                <img src={fileUrl} alt={`file-${index}`} width={200} />
                <br />
                <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                  Dosyayı Görüntüle
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>Yüklenmiş dosya yok.</p>
        )}
      </div>
    </div>
  );
};

export default App;
