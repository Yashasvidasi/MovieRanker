"use client";
import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const FilterCard = (props: {
  data: {
    gender: any;
    profile_path: any;
    id: number;
    poster_path: any;
    title: any;
    name: any;
  };
}) => {
  const router = useRouter();

  const truncateText = (s: string | undefined) => {
    if (!s) return null;
    return s.length > 25 ? `${s.slice(0, 24)}...` : s;
  };

  const generateLink = () => {
    if (props.data.name) {
      return props.data.gender
        ? `/person/${props.data.id}`
        : `/tv/${props.data.id}`;
    }
    return `/movie/${props.data.id}`;
  };

  const link = generateLink();

  return (
    <a href={link} rel="noopener noreferrer">
      <motion.div
        className="relative h-fit m-3 flex flex-col hover:cursor-pointer"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        onClick={(e) => {
          e.preventDefault();
          router.push(link);
        }}
      >
        <motion.div
          className="absolute top-0 left-0 w-full h-1 bg-red-500 rounded"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.3 }}
        />
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
        <p className="h-fit md:w-32 md:text-base text-xs w-24 mt-1 text-center self-center">
          {truncateText(props.data.title || props.data.name)}
        </p>
      </motion.div>
    </a>
  );
};

export default FilterCard;
