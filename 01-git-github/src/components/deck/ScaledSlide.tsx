import { useEffect, useRef, useState, type ReactNode } from "react";

export function ScaledSlide({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const { width, height } = el.getBoundingClientRect();
      setScale(Math.min(width / 1920, height / 1080));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative h-full w-full overflow-hidden">
      <div className="deck-scale-wrapper" style={{ transform: `scale(${scale})` }}>
        {children}
      </div>
    </div>
  );
}
