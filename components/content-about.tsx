import Image from "next/image";
import React from "react";

const ContentAbout = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-white text-3xl text-center font-bold pt-12">
        HAKKIMIZDA
      </h2>
      <div className="grid grid-cols-3 gap-12 text-white pt-16">
        <div className="col-span-2 place-content-center">
          <p className="pt-4 text-justify">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis
            doloribus, beatae consequatur sit amet delectus dicta ea tenetur et
            fuga explicabo placeat! Molestiae id commodi quia repudiandae
            quaerat dolores perferendis enim culpa soluta eaque alias delectus,
            optio cum debitis, doloribus deserunt harum voluptatibus non
            pariatur porro corporis suscipit, voluptatem unde!
          </p>{" "}
          <p className="pt-4 text-justify">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis
            doloribus, beatae consequatur sit amet delectus dicta ea tenetur et
            fuga explicabo placeat! Molestiae id commodi quia repudiandae
            quaerat dolores perferendis enim culpa soluta eaque alias delectus,
            optio cum debitis, doloribus deserunt harum voluptatibus non
            pariatur porro corporis suscipit, voluptatem unde!
          </p>
          <p className="pt-4 text-justify">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis
            doloribus, beatae consequatur sit amet delectus dicta ea tenetur et
            fuga explicabo placeat! Molestiae id commodi quia repudiandae
            quaerat dolores perferendis enim culpa soluta eaque alias delectus,
            optio cum debitis, doloribus deserunt harum voluptatibus non
            pariatur porro corporis suscipit, voluptatem unde!
          </p>
        </div>
        <div>
          <Image
            src="https://picsum.photos/600/800"
            alt="image source"
            width={600}
            height={600}
            className="w-full h-full object-cover rounded-xl shadow-2xl shadow-white/30"
          />
        </div>
      </div>
    </div>
  );
};

export default ContentAbout;
