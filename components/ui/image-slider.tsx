"use client";
import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import Image from "next/image";

export default function ImageSlider() {
  return (
    <>
      <Swiper className="mySwiper">
        <SwiperSlide>
          <Image
            src="https://picsum.photos/1920/800"
            alt="image source"
            width={1920}
            height={600}
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            src="https://picsum.photos/1920/800"
            alt="image source"
            width={1920}
            height={600}
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            src="https://picsum.photos/1920/800"
            alt="image source"
            width={1920}
            height={600}
          />
        </SwiperSlide>
      </Swiper>
    </>
  );
}
