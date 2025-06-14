"use client";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { CiPen } from "react-icons/ci";

export function CardDemo({ data }: { data: any }) {
  return (
    <Card
      className="w-full max-w-sm hover:-translate-y-4 transition duration-300 hover:shadow-2xl hover:shadow-black/30 group cursor-pointer"
      onClick={() => {
        window.open(data.link, "_blank");
      }}
    >
      <CardContent>
        <div className="flex flex-col items-start gap-2">
          <CiPen size={36} />
          <Link
            href={data.link}
            target="_blank"
            className="text-xl text-[#003354] font-medium group-hover:text-red-500"
          >
            {data.item}
          </Link>
          <p className="text-sm leading-6 text-[#444444]">
            Tüm boya gruplarında ve boya makinelerinde dünyanın en büyük
            üreticileri ile iş birliği içinde sizlere hizmet veriyoruz.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
