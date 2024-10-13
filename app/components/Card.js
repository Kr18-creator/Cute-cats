"use client";
import { useState } from "react";

export default function Card({ document }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="p-4 border rounded-lg shadow-lg cursor-pointer">
      {isLoading && (
          <div className="animate-spin h-5 w-5 border-4 border-t-transparent border-gray-500 rounded-full"></div>
      )}
      <img
        src={`/${document.type}.png`}
        alt={document.title}
        className="w-full"
        onLoad={() => {
          console.log("Image loaded");
          setIsLoading(false);
        }}
        onError={() => {
          console.log("Image failed to load");
          setIsLoading(false);
        }}
      />
      <h4 className="mt-2 text-lg font-semibold">{document.title}</h4>
    </div>
  );
}
