"use client";
import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const CastCard = (props: {
  data: {
    gender: any;
    profile_path: any;
    id: number;
    poster_path: any;
    title: any;
    name: any;
  };
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
    if (props.data.name) {
      return props.data.gender
        ? `/person/${props.data.id}`
        : `/tv/${props.data.id}`;
    }
    return `/movie/${props.data.id}`;
  };

  return (
    <motion.div
      className="relative h-fit flex flex-col hover:cursor-pointer"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => router.push(generateUrl())}
    >
      <motion.div
        className="absolute top-0 left-0 w-full h-1 bg-red-500 rounded"
        initial={{ width: 0 }}
      />
      <a
        href={generateUrl()}
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
      >
        {props.data.poster_path || props.data.profile_path ? (
          <img
            className="border-2 border-white md:h-48 md:w-28 h-36 w-20"
            src={`https://image.tmdb.org/t/p/w500${
              props.data.poster_path || props.data.profile_path
            }`}
            alt={props.data.title || props.data.name}
          />
        ) : (
          <div className="border-2 border-white md:h-48 md:w-28 h-36 w-20 flex flex-col justify-center items-center">
            <p className="self-center w-full text-center">
              Picture Not Available
            </p>
          </div>
        )}
      </a>

      <p className="h-fit md:w-28 w-20 mt-1 text-center self-center md:text-base text-xs">
        {truncatetext(props.data.title || props.data.name)}
      </p>
    </motion.div>
  );
};

export default CastCard;
