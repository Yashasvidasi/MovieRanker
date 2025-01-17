"use client";
import SideBar from "@/components/SideBar";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import Tile from "./Tile";
import { useRouter } from "next/navigation";

const tierColors = [
  "to-red-600",
  "to-orange-600",
  "to-yellow-600",
  "to-green-600",
  "to-teal-600",
  "to-blue-600",
  "to-indigo-600",
  "to-purple-600",
  "to-pink-600",
  "to-gray-600",
  "to-gray-300",
];

const Page: React.FC = () => {
  const { movieranking, setmovieranking } = useContext(UserContext)!;
  const [localSeriesRanking, setLocalSeriesRanking] = useState(movieranking);

  const handleRatingChange = (id: string, newRating: number) => {
    const updatedRanking = localSeriesRanking.map((series) =>
      series.id === id ? { ...series, rating: newRating } : series
    );
    setLocalSeriesRanking(updatedRanking);
  };

  const handleget = async () => {
    try {
      const response = await fetch(`/api/getuserdata`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (data.success) {
        setLocalSeriesRanking(data.movie_ranking);
      }
    } catch (err) {}
  };

  useEffect(() => {
    handleget();
  }, []);

  const getTierIndex = (rating: number) => {
    if (rating === 0) return 10;
    return 10 - Math.floor(rating);
  };

  const renderTiles = (tierIndex: number) => {
    return localSeriesRanking
      .filter((series) => getTierIndex(series.rating) === tierIndex)
      .sort((a, b) => b.rating - a.rating)
      .map((series, index) => (
        <Tile
          index={index}
          key={series.id}
          id={series.id}
          name={series.name}
          poster_path={series.poster_path}
          rating={series.rating}
          onRatingChange={handleRatingChange}
        />
      ));
  };

  const getletter = (num: number): string => {
    if (num === 0) {
      return "S";
    } else if (num === 10) {
      return "Not Rated";
    } else if (num >= 1 && num <= 9) {
      return String.fromCharCode(64 + num);
    } else {
      return "Invalid";
    }
  };

  return (
    <div className="flex flex-row overflow-hidden bg-black text-white">
      <SideBar />
      <div className="flex-1 p-6 w-full  overflow-auto h-screen scrollbar scrollbar-track-transparent scrollbar-thumb-white ">
        <header className="flex flex-row justify-between items-center mb-6 w-full">
          <div className="md:text-5xl text-3xl text-center  w-full">
            Tier List
          </div>
        </header>
        <div className="flex flex-col w-full space-y-4">
          {tierColors.map((color, tierIndex) => {
            return (
              <div
                key={tierIndex}
                className={`flex flex-row md:min-h-40 min-h-32 max-h-fit  bg-gradient-to-r from-black ${color} p-2 rounded-md`}
              >
                <div className="text-2xl text-center w-20 self-center">
                  {getletter(tierIndex)}
                </div>
                <div className="flex flex-wrap">{renderTiles(tierIndex)}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Page;
