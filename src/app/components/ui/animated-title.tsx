import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface AnimatedTitleProps {
  children: React.ReactNode;
  className?: string;
  underlineColor?: string;
}

export default function AnimatedTitle({ 
  children, 
  className = "",
  underlineColor = "from-blue-600 via-blue-400 to-transparent"
}: AnimatedTitleProps) {
  const titleRef = useRef(null);
  const isInView = useInView(titleRef, { amount: 0.3, margin: "-100px" });

  // Convert children to string and split into characters
  const text = typeof children === 'string' ? children : String(children);
  const characters = text.split('');

  return (
    <div ref={titleRef} className={`relative inline-block ${className}`}>
      <h1 className="text-lg font-base text-gray-900 uppercase tracking-tight text-center sm:text-left">
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
            style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
          >
            {char}
          </motion.span>
        ))}
      </h1>
      
      {/* Animated gradient underline - smaller */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ 
            duration: 0.8, 
            delay: characters.length * 0.03 + 0.2, 
            ease: [0.22, 1, 0.36, 1]
        }}
        className=" origin-left"
        >
        <div
            className="
            h-[2px] w-30
            bg-gradient-to-r from-blue-600 to-blue-600/0
            [mask-image:linear-gradient(to_right,black_60%,transparent_100%)]
            rounded-full
            "
        />
        </motion.div>
    </div>
  );
}