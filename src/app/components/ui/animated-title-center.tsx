import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface AnimatedTitleProps {
  children: React.ReactNode;
  className?: string;
}

export default function AnimatedTitleCenter({ 
  children, 
  className = ""
}: AnimatedTitleProps) {
  const titleRef = useRef(null);
  const isInView = useInView(titleRef, { amount: 0.3 });

  const text = typeof children === "string" ? children : String(children);
  const characters = text.split("");

  return (
    <div ref={titleRef} className={`relative inline-flex items-center justify-center gap-4 ${className}`}>
      
      {/* LEFT LINE — nhạt → đậm */}
      <motion.div
        initial={{ opacity: 0, x: -20, scaleX: 0 }}
        animate={
          isInView
            ? { opacity: 1, x: 0, scaleX: 1 }
            : { opacity: 0, x: -20, scaleX: 0 }
        }
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="
          h-[2px] w-20 origin-left rounded-full
          bg-gradient-to-r
          from-transparent
          to-blue-600
        "
      />

      {/* TITLE */}
      <h1 className="text-lg font-semibold text-gray-900 uppercase tracking-tight text-center">
        {characters.map((char, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{
              delay: index * 0.03,
              duration: 0.4,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="inline-block"
            style={{ whiteSpace: char === " " ? "pre" : "normal" }}
          >
            {char}
          </motion.span>
        ))}
      </h1>

      {/* RIGHT LINE — đậm → nhạt */}
      <motion.div
        initial={{ opacity: 0, x: 20, scaleX: 0 }}
        animate={
          isInView
            ? { opacity: 1, x: 0, scaleX: 1 }
            : { opacity: 0, x: 20, scaleX: 0 }
        }
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="
          h-[2px] w-20 origin-right rounded-full
          bg-gradient-to-l
          from-transparent
          to-blue-600
        "
      />
    </div>
  );
}
