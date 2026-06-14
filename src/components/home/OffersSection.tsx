"use client";

import { useState, useEffect } from "react";
import { Timer, Zap, Tag, Percent } from "lucide-react";

function getTimeToMidnight() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const diff = midnight.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { hours, minutes, seconds };
}

function DigitCard({ value }: { value: string }) {
  return (
    <div className="relative flex h-12 w-10 items-center justify-center rounded-lg border border-red-950/40 bg-[#0a0a0c] shadow-lg shadow-red-950/10 sm:h-14 sm:w-12">
      {/* Subtle inner glow */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-red-950/10 to-transparent" />
      <span className="relative text-xl font-black text-white font-mono sm:text-2xl">
        {value}
      </span>
      {/* Center divider line */}
      <div className="absolute inset-x-0 top-1/2 h-px bg-white/5" />
    </div>
  );
}

function TimerSeparator() {
  return (
    <span className="mx-0.5 text-lg font-black text-red-500 font-mono animate-pulse sm:mx-1">
      :
    </span>
  );
}

const offers = [
  {
    id: 1,
    icon: Percent,
    headline: "UP TO 40% OFF",
    description: "On premium Electronics — Laptops, Headphones & Smartwatches",
    gradient: "from-red-950 to-black",
    tag: "ELECTRONICS",
    tagCode: "ELEC_DEAL_40",
  },
  {
    id: 2,
    icon: Tag,
    headline: "BUY 2 GET 1 FREE",
    description: "On all Fashion items — Tees, Sneakers & Accessories",
    gradient: "from-red-900 to-black",
    tag: "FASHION",
    tagCode: "FASH_B2G1",
  },
  {
    id: 3,
    icon: Zap,
    headline: "FLAT ₹500 OFF",
    description: "On orders above ₹2,999 — Sitewide, no exceptions",
    gradient: "from-red-800 to-black",
    tag: "SITEWIDE",
    tagCode: "FLAT_500",
  },
];

export default function OffersSection() {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTime(getTimeToMidnight());

    const interval = setInterval(() => {
      setTime(getTimeToMidnight());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, "0");
  const h = mounted ? pad(time.hours) : "00";
  const m = mounted ? pad(time.minutes) : "00";
  const s = mounted ? pad(time.seconds) : "00";

  const scrollToProducts = (e: React.MouseEvent) => {
    e.preventDefault();
    const section = document.getElementById("products");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="mt-16 space-y-8">
      {/* Section Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1 select-none">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40 font-mono">
              ✦ LIMITED TIME // DEALS_ACTIVE
            </span>
          </div>
          <h2 className="flex items-center gap-3 text-3xl font-black text-white sm:text-4xl tracking-tight uppercase">
            <Zap
              size={28}
              className="text-red-500 animate-pulse"
              fill="currentColor"
            />
            FLASH DEALS
          </h2>
          <p className="mt-1 text-xs font-bold text-white/40 uppercase tracking-widest font-mono">
            ENDS AT MIDNIGHT — DON&apos;T MISS OUT
          </p>
        </div>

        {/* Countdown Timer */}
        <div className="flex flex-col items-start sm:items-end gap-2">
          <div className="flex items-center gap-1.5">
            <Timer size={14} className="text-red-500" />
            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-white/50 font-mono">
              DEAL EXPIRES IN
            </span>
          </div>
          <div className="flex items-center">
            {/* Hours */}
            <div className="flex gap-1">
              <DigitCard value={h[0]} />
              <DigitCard value={h[1]} />
            </div>
            <TimerSeparator />
            {/* Minutes */}
            <div className="flex gap-1">
              <DigitCard value={m[0]} />
              <DigitCard value={m[1]} />
            </div>
            <TimerSeparator />
            {/* Seconds */}
            <div className="flex gap-1">
              <DigitCard value={s[0]} />
              <DigitCard value={s[1]} />
            </div>
          </div>
          <div className="flex gap-6 text-[7px] font-mono text-white/30 uppercase tracking-widest">
            <span className="w-[84px] text-center sm:w-[100px]">HOURS</span>
            <span className="w-[84px] text-center sm:w-[100px]">MINUTES</span>
            <span className="w-[84px] text-center sm:w-[100px]">SECONDS</span>
          </div>
        </div>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {offers.map((offer) => {
          const Icon = offer.icon;
          return (
            <div
              key={offer.id}
              className="hud-corner group relative overflow-hidden rounded-2xl border border-red-950/20 bg-[#0a0a0c] shadow-xl transition-all duration-500 hover:border-red-900/40 hover:shadow-2xl hover:shadow-red-950/20"
            >
              {/* Background gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${offer.gradient} opacity-30 transition-opacity duration-500 group-hover:opacity-50`}
              />

              {/* Scanline effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-600/5 to-transparent h-1/2 w-full animate-scanline opacity-0 group-hover:opacity-100 pointer-events-none" />

              {/* Dot grid background */}
              <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-20">
                <svg
                  className="absolute inset-0 w-full h-full text-red-500/30"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <pattern
                      id={`dot-grid-${offer.id}`}
                      width="16"
                      height="16"
                      patternUnits="userSpaceOnUse"
                    >
                      <circle cx="1" cy="1" r="0.5" fill="currentColor" />
                    </pattern>
                  </defs>
                  <rect
                    width="100%"
                    height="100%"
                    fill={`url(#dot-grid-${offer.id})`}
                  />
                </svg>
              </div>

              {/* Content */}
              <div className="relative flex flex-col justify-between p-6 min-h-[260px]">
                {/* Tag & Icon */}
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-red-950/30 border border-red-950/40 px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-red-400 font-mono">
                    {offer.tag}
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-950/30 bg-red-950/20 text-red-500 transition-colors duration-300 group-hover:bg-red-950/40 group-hover:text-red-400">
                    <Icon size={20} />
                  </div>
                </div>

                {/* Deal Text */}
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="text-2xl font-black text-white uppercase tracking-wider leading-tight sm:text-3xl font-mono">
                    {offer.headline}
                  </h3>
                  <p className="mt-2 text-xs font-bold text-white/50 uppercase tracking-wider leading-relaxed font-mono">
                    {offer.description}
                  </p>
                </div>

                {/* Bottom bar */}
                <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                  <span className="text-[7px] font-mono text-white/25 uppercase tracking-widest">
                    CODE: {offer.tagCode}
                  </span>
                  <button
                    onClick={scrollToProducts}
                    className="group/btn flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white transition-all duration-300 hover:bg-red-500 hover:shadow-lg hover:shadow-red-600/25 font-mono cursor-pointer"
                  >
                    SHOP NOW
                    <span className="transition-transform duration-300 group-hover/btn:translate-x-0.5">
                      →
                    </span>
                  </button>
                </div>
              </div>

              {/* Hover glow bar */}
              <div className="h-1 w-full bg-red-600 opacity-0 transition-all duration-300 group-hover:opacity-100" />
            </div>
          );
        })}
      </div>

      {/* Bottom telemetry line */}
      <div className="flex items-center justify-center gap-4 pt-2">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-red-950/30 to-transparent" />
        <span className="text-[7px] font-mono text-white/20 uppercase tracking-[0.3em] select-none">
          [ DEALS_MODULE // LIVE // UPDATED_REALTIME ]
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-red-950/30 to-transparent" />
      </div>
    </section>
  );
}
