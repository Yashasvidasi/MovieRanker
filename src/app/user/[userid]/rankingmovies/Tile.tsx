"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface TileProps {
  index: number;
  id: string;
  name: string;
  poster_path: string;
  rating: number;
  onRatingChange: (id: string, newRating: number) => void;
}

const Tile: React.FC<TileProps> = ({
  index,
  id,
  name,
  poster_path,
  rating,
  onRatingChange,
}) => {
  return (
    <a
      href={`/movie/${id}`}
      className="md:w-24 md:h-36 h-28 w-16 border border-white hover:cursor-pointer m-1"
    >
      <motion.div
        whileHover={{
          scale: 1.04,
        }}
      >
        <img
          src={`https://image.tmdb.org/t/p/w500${poster_path}`}
          className="w-full h-full"
          alt=""
        />
      </motion.div>
    </a>
  );
};

export default Tile;
