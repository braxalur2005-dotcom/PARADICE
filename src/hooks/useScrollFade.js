import { useEffect, useState } from 'react';

/** Devuelve una opacidad (1 → 0) según el scroll vertical. */
export default function useScrollFade(distance = 600) {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const onScroll = () => setOpacity(Math.max(0, 1 - window.scrollY / distance));
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [distance]);

  return opacity;
}
