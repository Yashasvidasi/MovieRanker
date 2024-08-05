"use client";
import React, { Component, useContext } from "react";
import { motion, useAnimation } from "framer-motion";
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

  return (
    <motion.div
      className="relative h-fit flex flex-col hover:cursor-pointer"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => {
        if (props.data.name) {
          if (props.data.gender) {
            router.push(`/person/${props.data.id}`);
          } else {
            router.push(`/tv/${props.data.id}`);
          }
        } else {
          router.push(`/movie/${props.data.id}`);
        }
      }}
    >
      <motion.div
        className="absolute top-0 left-0 w-full h-1 bg-red-500 rounded"
        initial={{ width: 0 }}
      />
      {props.data.poster_path || props.data.profile_path ? (
        <img
          className="border-2 border-white h-48 w-28"
          src={`https://image.tmdb.org/t/p/w500${
            props.data.poster_path || props.data.profile_path
          }`}
          alt={props.data.title || props.data.name}
        />
      ) : (
        <div className="border-2 border-white h-48 w-28 flex flex-col justify-center items-center">
          <p className="self-center w-full text-center">
            Picture Not Available
          </p>
        </div>
      )}

      <p className="h-fi8 w-28 mt-1 text-center self-center">
        {truncatetext(props.data.title || props.data.name)}
      </p>
    </motion.div>
  );
};

export default CastCard;
