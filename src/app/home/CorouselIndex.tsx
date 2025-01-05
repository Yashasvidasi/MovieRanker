"use client";
import React, { useContext, useEffect, useState } from "react";
import corouselindex from "@/constants";
import { AppContext } from "../AppContext";
import { AnimatePresence, motion } from "framer-motion";
import arrowr from "../assets/arrowr.png";
import { Poppins } from "next/font/google";
import { list } from "postcss";
import DrawerIndex from "./DrawerIndex";
const lato = Poppins({
  weight: "400",
  subsets: ["latin"],
});
function CorouselIndex() {
  const [degree_roation, setdegree_roation] = useState("0deg");
  const [show, setshow] = useState(false);
  const { listType } = useContext(AppContext)!;
  useEffect(() => {
    if (show) {
      setdegree_roation("180deg");
    } else {
      setdegree_roation("0deg");
    }
  }, [show]);
  return (
    <div className="relative flex flex-col w-fit h-fit border border-white rounded-lg ml-3 z-50 text-white">
      {corouselindex
        .filter((item, index) => {
          return index === listType - 1;
        })
        .map((item, index) => {
          return (
            <div
              key={index}
              onClick={() => setshow(!show)}
              className="flex flex-row justify-between h-fit p-2 mx-2 hover:cursor-pointer text-lg text-nowrap w-fit px-4 pr-0 "
            >
              <p className="self-center">{item.name}</p>
              <img
                className="self-center min-w-7 h-7 opacity-100 ml-4"
                style={{
                  transform: `rotate(${degree_roation})`,
                  transition: "transform 0.3s ease-in-out",
                }}
                src={"/assets/arrowd.png"}
                alt="aasdasds"
              />
            </div>
          );
        })}
      <AnimatePresence>
        {show ? <DrawerIndex setshow={setshow} /> : null}
      </AnimatePresence>
    </div>
  );
}

export default CorouselIndex;
