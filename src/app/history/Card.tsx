"use client";
import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const Card = (props: {
  data: {
    gender: any;
    profile_path: any;
    id: number;
    poster_path: any;
    title: any;
    name: any;
    otype: any;
  };
  delete_: (id: number) => void;
}) => {
  const truncatetext = (s: string | undefined) => {
    if (s === undefined) {
      return null;
    }
    if (s.length > 25) {
      return s.slice(0, 24) + "...";
    } else {
      return s;
    }
  };

  const router = useRouter();
  const generateUrl = () => {
    if (props.data.otype == "tv") {
      return `/tv/${props.data.id}`;
    }
    return `/movie/${props.data.id}`;
  };

  return (
    <div className="relative h-fit flex flex-col hover:cursor-pointer">
      <motion.div
        whileHover={{ scale: 0.97 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          props.delete_(props.data.id);
        }}
        className="h-9 w-full items-center  flex flex-row justify-center bg-red-500 rounded-t-xl"
      >
        <img className="h-6 w-6 " src={`/assets/trash.png`} alt={"delete"} />
      </motion.div>
      <motion.div
        className="absolute top-0 left-0 w-full h-1 bg-red-500 rounded"
        initial={{ width: 0 }}
      />

      <motion.a
        href={generateUrl()}
        rel="noopener noreferrer"
        onClick={() => router.push(generateUrl())}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {props.data.poster_path || props.data.profile_path ? (
          <img
            className="border-2 border-white md:h-56 md:w-32 h-44 w-24"
            src={`https://image.tmdb.org/t/p/w500${
              props.data.poster_path || props.data.profile_path
            }`}
            alt={props.data.title || props.data.name}
          />
        ) : (
          <div className="border-2 border-white md:h-56 md:w-32 h-44 w-24 flex flex-col justify-center items-center">
            <p className="self-center w-full text-center">
              Picture Not Available
            </p>
          </div>
        )}
      </motion.a>
      <p className="h-fit md:w-32 md:text-base text-xs w-24 mt-1 text-center self-center">
        {truncatetext(props.data.title || props.data.name)}
      </p>
    </div>
  );
};

export default Card;
