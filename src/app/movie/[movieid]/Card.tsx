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

  // Generate the dynamic URL based on data
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
      onClick={() => router.push(generateUrl())} // Navigate normally on click
    >
      <motion.div
        className="absolute top-0 left-0 w-full h-1 bg-red-500 rounded"
        initial={{ width: 0 }}
      />
      <a
        href={generateUrl()} // Dynamic URL
        rel="noopener noreferrer" // Security and performance
        onClick={(e) => e.stopPropagation()} // Prevent click from triggering `onClick` above
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
      </a>
      <p className="h-fit md:w-32 md:text-base text-xs w-24 mt-1 text-center self-center">
        {truncatetext(props.data.title || props.data.name)}
      </p>
    </motion.div>
  );
};

export default Card;
