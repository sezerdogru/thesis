"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { ImageProp } from "../api/images/route";

type Props = {
  images: ImageProp[];
  loading: boolean;
  error: string | null;
};

const List = ({ images, loading, error }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const showImage = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1 + images.length) % images.length);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="">
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {images.length > 0 ? (
        <ul className="grid grid-cols-4 xl:grid-cols-6 md:grid-cols-6 gap-2">
          {images.map((image: ImageProp, index: number) => (
            <li key={image.key} className="mb-4">
              <Image
                src={image.url}
                alt={`file-${index}`}
                width={200}
                height={150}
                className="lg:h-[150px] h-20 object-cover cursor-pointer rounded-lg hover:scale-105 transition-transform"
                onClick={() => showImage(index)}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p>There is no image.</p>
      )}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/90 flex justify-center items-center z-50"
          onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
        >
          <span
            className="absolute top-5 right-8 text-white text-4xl cursor-pointer hover:text-red-500 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            &times;
          </span>
          <span
            className="absolute left-5 top-1/2 -translate-y-1/2 text-white text-5xl cursor-pointer hover:text-cyan-400 transition-colors"
            onClick={prevImage}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
          </span>
          <img
            src={images[currentIndex].url}
            alt=""
            className="max-w-[90%] max-h-[80vh] rounded-xl shadow-2xl animate-zoomIn"
          />

          <span
            className="absolute right-5 top-1/2 -translate-y-1/2 text-white text-5xl cursor-pointer hover:text-cyan-400 transition-colors"
            onClick={nextImage}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </span>
        </div>
      )}

      <style jsx>{`
        @keyframes zoomIn {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-zoomIn {
          animation: zoomIn 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default List;
