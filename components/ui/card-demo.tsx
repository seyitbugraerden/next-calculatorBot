"use client";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { CiPen } from "react-icons/ci";

export function CardDemo({ data }: { data: any }) {
  return (
    <Card
      className="w-full lg:max-w-sm hover:-translate-y-4 transition duration-300 hover:shadow-2xl hover:shadow-black/30 group cursor-pointer"
      onClick={() => {
        window.open(data.link, "_blank");
      }}
    >
      <CardContent>
        <div className="flex flex-col items-start gap-2">
          <div className="flex flex-row justify-between w-full gap-3 ">
            <Link
              href={data.link}
              target="_blank"
              className="text-xl text-[#003354] font-medium group-hover:text-red-500"
            >
              {data.item}
            </Link>{" "}
            {data.calculator ? (
              <Image
                src="/calculator.png"
                alt="LGS Puan Hesaplayıcı"
                width={32}
                height={32}
              />
            ) : (
              <Image
                src="/clock.png"
                alt="LGS Puan Hesaplayıcı"
                width={32}
                height={32}
              />
            )}
          </div>
          <p className="text-sm leading-6 text-[#444444]">{data.description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
