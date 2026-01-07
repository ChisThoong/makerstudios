"use client";

import { useEffect, useState } from "react";

interface TechStack {
  _id: string;
  id: number;
  name: string;
  imageUrl: string;
}

export default function TechStackSlider() {
  const [techStacks, setTechStacks] = useState<TechStack[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTechStacks() {
      try {
        const res = await fetch("/api/technology-stacks");
        const data = await res.json();

        if (data.success && data.techStacks) {
          setTechStacks(data.techStacks);
        }
      } catch (error) {
        console.error("Failed to fetch tech stacks:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTechStacks();
  }, []);

  // Split tech stacks into two rows (5 items each)
  const firstRow = techStacks.slice(0, 5);
  const secondRow = techStacks.slice(5, 10);

  if (loading) {
    return (
      <div className="py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="relative py-24 container max-w-7xl px-6 mx-auto overflow-hidden bg-cover bg-center bg-no-repeat">
      {/* First Row - Left to Right */}
      <div className="mb-8 overflow-hidden">
        <div className="flex animate-scroll-left gap-6">
          {/* Duplicate enough times for seamless loop */}
          {[...firstRow, ...firstRow, ...firstRow, ...firstRow, ...firstRow, ...firstRow, ...firstRow, ...firstRow, ...firstRow, ...firstRow, ...firstRow, ...firstRow].map((tech, index) => (
            <div
              key={`first-${tech._id}-${index}`}
              className="flex-shrink-0"
            >
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 w-40 h-40 flex flex-col items-center justify-center group">
                <img
                  src={tech.imageUrl}
                  alt={tech.name}
                  className="w-20 h-20 object-contain mb-3 transition-all duration-300 rounded-2xl"
                />
                <p className="text-sm font-semibold text-gray-700 text-center">
                  {tech.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Second Row - Right to Left */}
      <div className="overflow-hidden">
        <div className="flex animate-scroll-right gap-6">
          {/* Duplicate enough times for seamless loop */}
          {[...secondRow, ...secondRow, ...secondRow, ...secondRow, ...secondRow, ...secondRow, ...secondRow, ...secondRow, ...secondRow,...secondRow,...secondRow].map((tech, index) => (
            <div
              key={`second-${tech._id}-${index}`}
              className="flex-shrink-0"
            >
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 w-40 h-40 flex flex-col items-center justify-center group">
                <img
                  src={tech.imageUrl}
                  alt={tech.name}
                  className="w-20 h-20 object-contain mb-3 transition-all duration-300"
                />
                <p className="text-sm font-semibold text-gray-700 text-center">
                  {tech.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-25% - 0.75rem));
          }
        }

        @keyframes scroll-right {
          0% {
            transform: translateX(calc(-25% - 0.75rem));
          }
          100% {
            transform: translateX(0);
          }
        }

        .animate-scroll-left {
          animation: scroll-left 30s linear infinite;
          width: max-content;
        }

        .animate-scroll-right {
          animation: scroll-right 30s linear infinite;
          width: max-content;
        }

        .animate-scroll-left:hover,
        .animate-scroll-right:hover {
        
        }
      `}</style>
    </div>
  );
}