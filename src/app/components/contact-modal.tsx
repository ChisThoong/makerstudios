"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useLanguage } from "../context/language-context";

interface ContactModalProps {
  isOpen: boolean;
  status: "idle" | "loading" | "success" | "error";
  message?: string;
  onClose: () => void;
}

export default function ContactModal({
  isOpen,
  status,
  message,
  onClose,
}: ContactModalProps) {
  const [countdown, setCountdown] = useState(3);
  const { t } = useLanguage();

  useEffect(() => {
    if (status === "success" || status === "error") {
      setCountdown(3);

      const timer = setTimeout(onClose, 3000);
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
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
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 bg-white rounded-3xl p-10 w-[90%] max-w-md shadow-2xl">
        {/* Loading */}
        {status === "loading" && (
          <div className="flex flex-col items-center gap-6 text-center">
            <Loader2 className="h-14 w-14 text-blue-600 animate-spin" />
            <p className="text-xl font-semibold">
              {t("contactModal.sending")}
            </p>
            <p className="text-gray-500">
              {t("contactModal.pleaseWait")}
            </p>
          </div>
        )}

        {/* Success */}
        {status === "success" && (
          <div className="flex flex-col items-center gap-6 text-center">
            <CheckCircle className="h-14 w-14 text-green-600" />
            <h3 className="text-2xl font-bold">
              {t("contactModal.successTitle")}
            </h3>
            <p className="text-gray-600">{message}</p>
            <p className="text-gray-400 text-sm">
              {t("modal.autoClose").replace("{count}", countdown.toString())}
            </p>
          </div>
        )}

        {/* Error */}
        {status === "error" && (
          <div className="flex flex-col items-center gap-6 text-center">
            <XCircle className="h-14 w-14 text-red-600" />
            <h3 className="text-2xl font-bold">
              {t("contactModal.errorTitle")}
            </h3>
            <p className="text-gray-600">{message}</p>
            <p className="text-gray-400 text-sm">
              {t("modal.autoClose").replace("{count}", countdown.toString())}
            </p>
          </div>
        )}

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
