import { useState } from 'react';
import { SITE } from '../config/site';

/** Muestra el logo de public/. Si no se puede cargar, muestra las iniciales. */
export default function Logo({ size = 'w-12 h-12', textSize = 'text-2xl' }) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={`${size} flex shrink-0 items-center justify-center overflow-hidden ${
        failed ? 'rounded-full border-2 border-white bg-brand font-bold text-white shadow-md' : ''
      }`}
    >
      {failed ? (
        <span className={`font-brush ${textSize}`}>LP</span>
      ) : (
        <img
          src={`${import.meta.env.BASE_URL}logo.png`}
          alt={`Logo ${SITE.name}`}
          className="h-full w-full object-contain"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
