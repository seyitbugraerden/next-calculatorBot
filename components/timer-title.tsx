import Image from "next/image";
import React from "react";

const TimerTitle = ({ title }: ContentProps) => {
  return (
    <div className="flex flex-row justify-center items-center gap-3">
      <Image
        src="/clock.png"
        alt="LGS Puan Hesaplayıcı"
        width={32}
        height={32}
      />
      <h1 className="text-3xl font-bold mb-2 text-white">{title}</h1>
    </div>
  );
};

export default TimerTitle;
