"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useLanguage } from "../context/language-context";

export default function SubscribeModal({ isOpen, status, message, onClose }: any) {
  const [countdown, setCountdown] = useState(3);
  const { t } = useLanguage();

  useEffect(() => {
    if (status === "success" || status === "error") {
      setCountdown(3);
      const timer = setTimeout(onClose, 3000);
      
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        clearTimeout(timer);
        clearInterval(countdownInterval);
      };
    }
  }, [status, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Enhanced Background with Gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal with Glass Morphism Effect */}
      <div
        className="
          relative z-10 
          bg-white/95 backdrop-blur-xl
          rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]
          p-10 w-[90%] max-w-md
          border border-gray-100
          animate-[modalSlideUp_0.4s_cubic-bezier(0.16,1,0.3,1),modalFadeIn_0.4s_ease-out]
        "
        style={{
          animation: `
            modalSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1),
            modalFadeIn 0.4s ease-out
          `
        }}
      >
        {/* Loading State */}
        {status === "loading" && (
          <div className="flex flex-col items-center text-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-400/20 blur-xl rounded-full animate-pulse"></div>
              <Loader2 className="relative h-16 w-16 text-blue-600 animate-spin" strokeWidth={2.5} />
            </div>
            <div className="space-y-2">
              <p className="text-gray-900 text-xl font-semibold">{t('modal.processing')}</p>
              <p className="text-gray-500 text-sm">{t('modal.pleaseWait')}</p>
            </div>
          </div>
        )}

        {/* Success State */}
        {status === "success" && (
          <div className="flex flex-col items-center text-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-green-400/20 blur-2xl rounded-full animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-green-400 to-green-600 rounded-full p-4 shadow-lg shadow-green-500/30">
                <CheckCircle className="h-12 w-12 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-gray-900 text-2xl font-bold">{t('modal.awesome')}</h3>
              <p className="text-gray-600 text-base leading-relaxed">{message}</p>
              <div className="flex items-center justify-center gap-2 pt-2">
                <div className="h-2.5 w-2.5 bg-green-500 rounded-full animate-bounce shadow-lg shadow-green-500/50"></div>
                <div className="h-2.5 w-2.5 bg-green-500 rounded-full animate-bounce shadow-lg shadow-green-500/50" style={{ animationDelay: '0.15s' }}></div>
                <div className="h-2.5 w-2.5 bg-green-500 rounded-full animate-bounce shadow-lg shadow-green-500/50" style={{ animationDelay: '0.3s' }}></div>
              </div>
              <p className="text-gray-400 text-xs">
                {t('modal.autoClose').replace('{count}', countdown.toString())}
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {status === "error" && (
          <div className="flex flex-col items-center text-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-red-400/20 blur-2xl rounded-full animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-red-400 to-red-600 rounded-full p-4 shadow-lg shadow-red-500/30">
                <XCircle className="h-12 w-12 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-gray-900 text-2xl font-bold">{t('modal.error')}</h3>
              <p className="text-gray-600 text-base leading-relaxed">{message}</p>
              <div className="flex items-center justify-center gap-2 pt-2">
                <div className="h-2.5 w-2.5 bg-red-500 rounded-full animate-bounce shadow-lg shadow-red-500/50"></div>
                <div className="h-2.5 w-2.5 bg-red-500 rounded-full animate-bounce shadow-lg shadow-red-500/50" style={{ animationDelay: '0.15s' }}></div>
                <div className="h-2.5 w-2.5 bg-red-500 rounded-full animate-bounce shadow-lg shadow-red-500/50" style={{ animationDelay: '0.3s' }}></div>
              </div>
              <p className="text-gray-400 text-xs">
                {t('modal.autoClose').replace('{count}', countdown.toString())}
              </p>
            </div>
          </div>
        )}

        {/* Close Button - Optional */}
        <button
          onClick={onClose}
          className="
            absolute top-4 right-4 
            text-gray-400 hover:text-gray-600 
            transition-colors duration-200
            p-1 rounded-full hover:bg-gray-100
          "
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}