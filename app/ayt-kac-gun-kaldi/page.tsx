"use client";
import Image from "next/image";
import Link from "next/link";
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
  const targetDate = new Date("2025-06-22T10:15:00"); // TYT sınav tarihi ve saati

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
    <div className="w-screen h-screen flex justify-center items-center overflow-x-hidden">
      <div className="flex flex-col items-center justify-center">
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 max-w-md mx-auto text-center shadow-md">
          <div className="flex flex-row justify-center items-center gap-3">
            <Image
              src="/clock.png"
              alt="LGS Kaç Gün Kaldı"
              width={32}
              height={32}
            />
            <h1 className="text-3xl font-bold mb-2">AYT Kaç Gün Kaldı</h1>
          </div>
          <div className="flex flex-col md:flex-row justify-center gap-4 space-y-6 mt-12">
            <CircleProgress value={timeLeft.days} max={365} label="Gün" />
            <CircleProgress value={timeLeft.hours} max={24} label="Saat" />
            <CircleProgress value={timeLeft.minutes} max={60} label="Dakika" />
            <CircleProgress value={timeLeft.seconds} max={60} label="Saniye" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 mt-10">
          {[
            {
              item: "LGS Puan Hesaplayıcı",
              link: "/lgs-puan-hesaplama",
              color: "36, 112, 38",
            },
            {
              item: "LGS Kaç Gün Kaldı?",
              link: "/lgs-kac-gun-kaldi",
              color: "25, 80, 148",
            },
            {
              item: "TYT Puan Hesaplayıcı",
              link: "/tyt-puan-hesaplama",
              color: "14, 14, 181",
            },
            {
              item: "Tyt Kaç Gün Kaldı?",
              link: "/tyt-kac-gun-kaldi",
              color: "134, 14, 181",
            },
            {
              item: "AYT Puan Hesaplayıcı",
              link: "/ayt-puan-hesaplama",
              color: "199, 252, 5",
            },
            {
              item: "AYT Kaç Gün Kaldı?",
              link: "/ayt-kac-gun-kaldi",
              color: "138, 51, 36",
              disabled: true,
            },
          ].map((x, idx) => (
            <Link
              href={x.link}
              target="_blank"
              key={idx}
              style={{ backgroundColor: `rgba(${x.color},0.2)` }}
              className={`flex flex-row gap-2 items-center px-4 py-2 text-black sm:mx-6 rounded hover:opacity-50 transition duration-300 ${
                x.disabled &&
                "pointer-events-none opacity-30 !cursor-not-allowed"
              }`}
            >
              <Image
                src="/book.svg"
                alt="Book Png"
                width={24}
                height={24}
                style={{ fill: `rgb(${x.color})` }}
              />
              <span className="text-sm font-medium">{x.item}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
