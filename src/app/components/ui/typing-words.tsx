"use client";

import { useEffect, useState } from "react";

interface TypingWordsProps {
  words: string[];
  typingSpeed?: number;
  deleteSpeed?: number;
  delayBetweenWords?: number;
  className?: string;
}

export default function TypingWords({
  words,
  typingSpeed = 120,
  deleteSpeed = 80,
  delayBetweenWords = 1000,
  className = ""
}: TypingWordsProps) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (index >= words.length) return;

    if (!deleting && subIndex === words[index].length) {
      // Đợi 1 chút rồi xoá
      setTimeout(() => setDeleting(true), delayBetweenWords);
      return;
    }

    if (deleting && subIndex === 0) {
      // Chuyển sang từ tiếp theo
      setDeleting(false);
      setIndex(prev => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex(prev => prev + (deleting ? -1 : 1));
    }, deleting ? deleteSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [subIndex, index, deleting, words, typingSpeed, deleteSpeed, delayBetweenWords]);

  return (
    <span className={`text-blue-600 ${className}`}>
      {words[index].substring(0, subIndex)}
      <span className="inline-block w-[2px] bg-blue-600 animate-pulse ml-0.5"></span>
    </span>
  );
}
