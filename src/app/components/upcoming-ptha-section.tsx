"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, Play, X } from "lucide-react";
import { useLanguage } from "../context/language-context";

const featureItems = [
  {
    titleKey: "upcomingPtha.feature1.title",
    descriptionKey: "upcomingPtha.feature1.description",
    image: "/images/ptha/icon_menu_5.png",
  },
  {
    titleKey: "upcomingPtha.feature2.title",
    descriptionKey: "upcomingPtha.feature2.description",
    image: "/images/ptha/icon_menu_2.png",
  },
  {
    titleKey: "upcomingPtha.feature3.title",
    descriptionKey: "upcomingPtha.feature3.description",
    image: "/images/ptha/icon_menu_3.png",
  },
];

const LAUNCH_DATE = new Date("2026-06-07T00:00:00+07:00").getTime();
const TRAILER_VIDEO_SRC = "/images/ptha/night-at-the-valley-promo-2.mp4";
const INITIAL_COUNTDOWN = { days: 0, hours: 0, minutes: 0, seconds: 0 };

const getCountdown = () => {
  const distance = Math.max(0, LAUNCH_DATE - Date.now());
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  return { days, hours, minutes, seconds };
};

const UpcomingSeasonSection = () => {
  const { t } = useLanguage();
  const [countdown, setCountdown] = React.useState(INITIAL_COUNTDOWN);
  const [isTrailerOpen, setIsTrailerOpen] = React.useState(false);

  React.useEffect(() => {
    setCountdown(getCountdown());

    const timer = window.setInterval(() => {
      setCountdown(getCountdown());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  React.useEffect(() => {
    if (!isTrailerOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsTrailerOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isTrailerOpen]);

  const countdownItems = [
    { value: countdown.days, label: t("upcomingPtha.countdown.days") },
    { value: countdown.hours, label: t("upcomingPtha.countdown.hours") },
    { value: countdown.minutes, label: t("upcomingPtha.countdown.minutes") },
    { value: countdown.seconds, label: t("upcomingPtha.countdown.seconds") },
  ];

  return (
    <section className="relative w-full bg-white px-4 py-10 sm:px-6 md:py-14 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[28px] border border-blue-200/80 bg-white shadow-[0_24px_70px_rgba(37,99,235,0.16)]">
        <div className="relative min-h-[760px] overflow-hidden bg-[linear-gradient(105deg,#ffffff_0%,#ffffff_25%,rgba(255,255,255,0.9)_39%,rgba(255,255,255,0)_66%)">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_20%,rgba(59,130,246,0.24),transparent_26%),radial-gradient(circle_at_80%_66%,rgba(14,165,233,0.18),transparent_30%)]" />

          <div className="relative z-10 grid min-h-[560px] grid-cols-1 lg:grid-cols-[0.95fr_1.25fr]">
            <div className="flex flex-col px-6 pb-6 pt-8 text-center sm:px-10 md:px-12 md:pt-10 lg:pb-0 lg:text-left">
              <div className="flex flex-col items-center gap-4 text-sm font-semibold uppercase tracking-[0.16em] text-slate-500 md:flex-row lg:items-start">
                <div className="inline-flex items-center gap-3 rounded-2xl bg-blue-600 px-5 py-3 text-white shadow-[0_12px_28px_rgba(37,99,235,0.34)]">
                  <CalendarDays className="h-5 w-5" />
                  <span className="whitespace-nowrap">{t("upcomingPtha.badge")}</span>
                </div>
                {/* <div className="hidden h-px w-10 bg-blue-300 md:block" />
                <span>
                  <strong className="text-slate-700">IDLE TD</strong>
                  <span className="mx-2 text-blue-300">•</span>
                  MONSTER DEFENSE
                </span> */}
              </div>

              <div className="mt-10 flex flex-col items-center lg:items-start">
                <img
                  src="/images/ptha/logo-vi-2.png"
                  alt={t("upcomingPtha.logoAlt")}
                  className="mt-1 w-full max-w-[430px] drop-shadow-[0_12px_24px_rgba(37,99,235,0.18)] md:max-w-[520px] lg:max-w-[560px]"
                />

                <p className="mt-5 max-w-[500px] text-base leading-7 text-slate-600 md:text-lg">
                  {t("upcomingPtha.description")}
                </p>

                <div className="mt-8 flex w-full flex-col gap-4 md:w-auto md:flex-row">
                  <div className="rounded-2xl border-2 border-blue-100 bg-white/90 px-5 py-4 text-blue-600 shadow-[0_14px_30px_rgba(37,99,235,0.16)] backdrop-blur">
                    <div className="text-center text-xs font-black uppercase tracking-[0.16em] text-slate-700 md:text-sm">
                      {t("upcomingPtha.countdownTitle")}
                    </div>
                    <div className="mt-3 grid grid-cols-4 divide-x divide-blue-200">
                      {countdownItems.map((item) => (
                        <div key={item.label} className="min-w-[58px] px-3 text-center">
                          <div className="text-2xl font-black leading-none text-blue-600 md:text-3xl">
                            {String(item.value).padStart(2, "0")}
                          </div>
                          <div className="mt-1 text-[10px] font-black uppercase text-slate-700 md:text-xs">
                            {item.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsTrailerOpen(true)}
                    className="inline-flex min-h-[72px] items-center justify-center gap-3 rounded-2xl border-2 border-blue-200 bg-white/80 px-6 py-3 text-base font-black uppercase text-blue-600 shadow-[0_12px_28px_rgba(37,99,235,0.12)] transition hover:border-blue-400 hover:bg-white"
                  >
                    <Play className="h-5 w-5 fill-current" />
                    <span className="whitespace-nowrap">{t("upcomingPtha.trailer")}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="relative min-h-[390px] md:min-h-[430px] lg:min-h-full">
              <img
                src="/images/ptha/monkey.png"
                alt="Monkey"
                className="absolute left-6 top-0 z-30 w-32 -rotate-6 animate-float-top-left drop-shadow-2xl md:left-16 md:top-[-12px] md:w-44 lg:left-[-12px] lg:top-0 lg:w-40 xl:left-4 xl:w-48"
                style={{ filter: "drop-shadow(0 0 20px rgba(37, 99, 235, 0.35))" }}
              />
              <img
                src="/images/ptha/moo.png"
                alt="Moo"
                className="absolute right-0 top-10 z-20 w-64 rotate-6 animate-float-center drop-shadow-2xl md:right-12 md:top-16 md:w-80 lg:right-20 lg:top-20 lg:w-96 xl:w-[26rem]"
                style={{ filter: "drop-shadow(0 0 20px rgba(14, 165, 233, 0.35))" }}
              />
              <img
                src="/images/ptha/lulu.png"
                alt="Lulu"
                className="absolute bottom-8 left-8 z-30 w-36 -rotate-3 animate-float-medium drop-shadow-2xl md:bottom-10 md:left-10 md:w-48 lg:bottom-2 lg:left-[-4px] lg:w-52 xl:left-8"
                style={{ filter: "drop-shadow(0 0 20px rgba(37, 99, 235, 0.28))" }}
              />
              <img
                src="/images/bg_4.png"
                alt=""
                className="absolute left-8 top-12 w-16 animate-float-slow opacity-80 md:left-24 md:w-20"
              />
             
              {/* <div className="absolute bottom-0 left-6 right-6 h-24 rounded-[50%] bg-lime-300/10 blur-xl" /> */}
            </div>
          </div>

          <div className="relative z-20 mx-4 mb-4 mt-10 grid gap-4 rounded-[24px] border border-blue-100 bg-white/88 p-4 shadow-[0_18px_45px_rgba(37,99,235,0.12)] backdrop-blur md:mx-8 md:mb-8 md:grid-cols-3 md:p-5">
            {featureItems.map((item, index) => (
              <div
                key={item.titleKey}
                className={`grid grid-cols-[76px_1fr] items-center gap-4 md:grid-cols-[92px_1fr] ${
                  index > 0 ? "md:border-l md:border-blue-100 md:pl-6" : ""
                }`}
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 md:h-24 md:w-24">
                  <img src={item.image} alt="" className="max-h-16 max-w-16 object-contain md:max-h-20 md:max-w-20" />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase leading-tight text-blue-600 md:text-xl">
                    {t(item.titleKey)}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 md:text-base">
                    {t(item.descriptionKey)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isTrailerOpen && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/70 px-4 py-6 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            onClick={() => setIsTrailerOpen(false)}
          >
            <motion.div
              className="relative flex max-h-full w-full max-w-[min(420px,calc(100vw-2rem))] items-center justify-center"
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                aria-label={t("upcomingPtha.closeTrailer")}
                onClick={() => setIsTrailerOpen(false)}
                className="absolute -right-2 -top-2 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white text-blue-600 shadow-[0_12px_30px_rgba(15,23,42,0.28)] transition hover:scale-105 hover:bg-blue-50"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="relative aspect-[9/16] max-h-[min(82vh,760px)] w-full overflow-hidden rounded-[24px] border border-blue-200 bg-slate-950 shadow-[0_30px_90px_rgba(15,23,42,0.42)]">
                <video
                  src={TRAILER_VIDEO_SRC}
                  className="h-full w-full object-cover"
                  controls
                  autoPlay
                  playsInline
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default UpcomingSeasonSection;
