"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function FollowCursor() {
  const mouseRef = useRef({ x: 0, y: 0 });
  const dot1Ref = useRef({ x: 0, y: 0 });
  const dot2Ref = useRef({ x: 0, y: 0 });
  const dot1El = useRef<HTMLDivElement>(null);
  const dot2El = useRef<HTMLDivElement>(null);
  const rafId = useRef<number>(0);

  const pathname = usePathname();
if (pathname.startsWith("/admin") || pathname.startsWith("/login")) return null;

  useEffect(() => {
    function handleMove(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    }
    window.addEventListener("mousemove", handleMove);

    // Animation loop using requestAnimationFrame for smooth 60fps
    function animate() {
      // Small dot (follows mouse with easing)
      dot1Ref.current.x += (mouseRef.current.x - dot1Ref.current.x) * 0.2;
      dot1Ref.current.y += (mouseRef.current.y - dot1Ref.current.y) * 0.2;

      // Large trailing dot (slower easing)
      dot2Ref.current.x += (mouseRef.current.x - dot2Ref.current.x) * 0.08;
      dot2Ref.current.y += (mouseRef.current.y - dot2Ref.current.y) * 0.08;

      // Update DOM with will-change optimization
      if (dot1El.current) {
        dot1El.current.style.transform = `translate3d(${dot1Ref.current.x - 6}px, ${dot1Ref.current.y - 6}px, 0)`;
      }
      if (dot2El.current) {
        dot2El.current.style.transform = `translate3d(${dot2Ref.current.x - 16}px, ${dot2Ref.current.y - 16}px, 0)`;
      }

      rafId.current = requestAnimationFrame(animate);
    }

    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  return (
    <>
      {/* Small bright dot */}
      <div
        ref={dot1El}
        className="pointer-events-none fixed top-0 left-0 z-50 
                   w-3 h-3 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50"
        style={{
          willChange: 'transform',
        }}
      />

      {/* Larger faint trailing dot */}
      <div
        ref={dot2El}
        className="pointer-events-none fixed top-0 left-0 z-40 
                   w-8 h-8 rounded-full bg-blue-400/40 blur-sm"
        style={{
          willChange: 'transform',
        }}
      />
    </>
  );
}