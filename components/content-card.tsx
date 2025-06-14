import React from "react";
import { CardDemo } from "./ui/card-demo";

const ContentCard = ({
  title,
  content,
  data,
}: {
  title: string;
  content: string;
  data: any;
}) => {
  return (
    <section className="max-w-8xl mx-auto">
      <h2 className="text-white text-3xl text-center font-bold pt-12">
        {title}
      </h2>
      <div className="grid grid-cols-4 gap-4 mt-16">
        {data.map((x: any) => {
          return <CardDemo key={x.link} data={x} />;
        })}
      </div>
      <p className="mt-12 text-white text-sm text-justify">{content}</p>
    </section>
  );
};

export default ContentCard;
