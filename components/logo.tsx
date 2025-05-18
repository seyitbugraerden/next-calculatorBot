import Image from "next/image";
import React from "react";

const LogoDep = () => {
  return (
    <Image
      src="/logo.webp"
      alt="Logo"
      width={900}
      height={900}
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full z-[-999] object-contain opacity-10"
    />
  );
};
export default LogoDep;
