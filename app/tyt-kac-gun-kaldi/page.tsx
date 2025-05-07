"use client";
import { useEffect, useState } from "react";

const getPercentage = (value: number, max: number) => (value / max) * 100;

const CircleProgress = ({
  value,
  max,
  label,
}: {
  value: number;
  max: number;
  label: string;
}) => (
  <div className="flex flex-col items-center">
    <div className="relative flex justify-center items-center w-20 h-20">
      <svg className="w-full h-full">
        <circle
          cx="50%"
          cy="50%"
          r="40%"
          className="stroke-gray-300 fill-none"
          strokeWidth="8"
        />
        <circle
          cx="50%"
          cy="50%"
          r="40%"
          className="stroke-blue-600 fill-none"
          strokeWidth="8"
          strokeDasharray={251.2}
          strokeDashoffset={251.2 - (251.2 * getPercentage(value, max)) / 100}
          strokeLinecap="round"
          style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
        />
      </svg>
      <span className="absolute text-lg font-bold">{value}</span>
    </div>
    <span className="mt-2 text-sm font-semibold text-gray-700">{label}</span>
  </div>
);

export default function TytCountdownTimer() {
  const targetDate = new Date("2025-06-21T10:15:00"); // TYT sınav tarihi ve saati

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 max-w-md mx-auto text-center shadow-md">
      <h2 className="text-xl font-bold mb-4">2025 TYT'ye Kalan Süre</h2>
      <div className="flex justify-center gap-4">
        <CircleProgress value={timeLeft.days} max={365} label="Gün" />
        <CircleProgress value={timeLeft.hours} max={24} label="Saat" />
        <CircleProgress value={timeLeft.minutes} max={60} label="Dakika" />
        <CircleProgress value={timeLeft.seconds} max={60} label="Saniye" />
      </div>
    </div>
  );
}
