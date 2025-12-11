"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface Props {
  text: string;
  className?: string;
}

export default function AnimatedSplitText({ text, className }: Props) {
  const ref = useRef(null);

  const isInView = useInView(ref, {
    margin: "-10% 0px -10% 0px",
  });

  const letters = text.split("");

  return (
    <div ref={ref} className={`inline-block overflow-hidden ${className}`}>
      {letters.map((char, i) => (
        <motion.span
          key={i}
          style={{ display: "inline-block" }}
          animate={
            isInView
              ? { opacity: 1, x: 0 }
              : { opacity: 0.3, x: -7 } 
          }
          transition={{
            delay: i * 0.03,
            duration: 0.4,
            ease: [0.25, 0.1, 0.25, 1.0],
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </div>
  );
}
