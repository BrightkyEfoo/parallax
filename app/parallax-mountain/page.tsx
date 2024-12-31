"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const ParalaxMountain = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "500%"]);
  const textX = useTransform(scrollYProgress, [0, 1], ["0%", "200%"]);
  return (
    <div className="mx-auto container">
      <div
        ref={ref}
        className="h-screen relative flex items-center pl-12 overflow-hidden"
      >
        <motion.h2
          className="z-10 relative text-[70px] font-extrabold"
          style={{ y: textY, x: textX }}
        >
          Parallax Mountain
        </motion.h2>
        <motion.div
          className="inset-0 absolute h-full w-full top-0 left-0"
          style={{
            backgroundImage: "url(/mountain.jpg)",
            backgroundSize: "cover",
            y: backgroundY,
            backgroundPosition: "bottom",
          }}
        />
        <div
          className="inset-0 absolute h-full w-full top-0 left-0 z-20"
          style={{
            backgroundImage: "url(/Subtract.png)",
            backgroundSize: "cover",
            backgroundPosition: "bottom",
          }}
        />
      </div>
      <div className="space-y-5 mt-5">
        {[
          ...Array.from({ length: 12 }).map((el, idx) => {
            return (
              <div key={`text-${idx}`} className="mx-auto w-[80%]">
                <p className="text-3xl">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Doloribus doloremque veniam fugiat laborum tempore vero.
                  Officiis perferendis commodi sint a expedita ea suscipit
                  dicta, harum consectetur. Quae aperiam numquam nobis?
                </p>
              </div>
            );
          }),
        ]}
      </div>
    </div>
  );
};

export default ParalaxMountain;
