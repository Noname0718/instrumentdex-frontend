import { useState } from "react";

const FALLBACK_IMAGE = "/placeholder-instrument.svg";

export default function InstrumentImage({
  imageUrl,
  alt,
  className = "",
  ...imgProps
}) {
  const [hasError, setHasError] = useState(false);
  const resolvedSrc = !imageUrl || hasError ? FALLBACK_IMAGE : imageUrl;

  return (
    <img
      src={resolvedSrc}
      alt={alt || "악기 이미지"}
      onError={() => setHasError(true)}
      className={className}
      {...imgProps}
    />
  );
}
