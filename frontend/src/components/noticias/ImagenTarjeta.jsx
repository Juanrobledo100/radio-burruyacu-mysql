import React, { useState, useEffect } from "react";
import { ImageOff } from "lucide-react";

const ImagenTarjeta = ({
  src,
  alt = "",
  fill = false,
  zoomOnHover = false,
  objectFit = "cover",
  className = "",
  imgClassName = "",
}) => {
  const [error, setError] = useState(false);

  useEffect(() => setError(false), [src]);

  const wrapperClase = `${fill ? "absolute inset-0" : "relative w-full h-full"} overflow-hidden bg-slate-950 ${className}`;

  if (!src || error) {
    return (
      <div className={`${wrapperClase} flex items-center justify-center`}>
        <ImageOff className="w-6 h-6 text-slate-700" />
      </div>
    );
  }

  return (
    <div className={wrapperClase}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onError={() => setError(true)}
        className={`w-full h-full ${objectFit === "contain" ? "object-contain" : "object-cover"} ${
          zoomOnHover ? "transition-transform duration-500 group-hover:scale-105" : ""
        } ${imgClassName}`}
      />
    </div>
  );
};

export default ImagenTarjeta;
