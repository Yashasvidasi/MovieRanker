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
  const router = useRouter();
  return (
    <motion.div
      className="w-24 h-36 border border-white hover:cursor-pointer m-1"
      onClick={() => {
        router.push(`/movie/${id}`);
      }}
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
  );
};

export default Tile;
