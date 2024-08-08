"use client";
import SideBar from "@/components/SideBar";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import Tile from "./Tile"; // Adjust the path as needed
import { useRouter } from "next/navigation";

const tierColors = [
  "to-red-600", // Tier 1: Rating 10
  "to-orange-600", // Tier 2: Rating 9-10
  "to-yellow-600", // Tier 3: Rating 8-9
  "to-green-600", // Tier 4: Rating 7-8
  "to-teal-600", // Tier 5: Rating 6-7
  "to-blue-600", // Tier 6: Rating 5-6
  "to-indigo-600", // Tier 7: Rating 4-5
  "to-purple-600", // Tier 8: Rating 3-4
  "to-pink-600", // Tier 9: Rating 2-3
  "to-gray-600", // Tier 10: Rating 1-2
  "to-gray-300", // Not Ranked: Rating 0
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
      console.log(data);
      if (data.success) {
        setLocalSeriesRanking(data.movie_ranking);
      }
    } catch (err) {
      //try again 3 times
    }
  };

  useEffect(() => {
    handleget();
  }, []);

  const getTierIndex = (rating: number) => {
    if (rating === 0) return 10;
    return 10 - Math.floor(rating);
  };

  const renderTiles = (tierIndex: number) => {
    console.log(localSeriesRanking);
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
      // Convert number to corresponding letter (1 -> A, 2 -> B, ..., 9 -> I)
      return String.fromCharCode(64 + num);
    } else {
      return "Invalid"; // Handle numbers outside the range 0-10 if needed
    }
  };

  return (
    <div className="flex flex-row overflow-hidden">
      <SideBar />
      <div className="flex-1 p-6 w-full  overflow-auto h-screen scrollbar scrollbar-track-transparent scrollbar-thumb-white ">
        <header className="flex flex-row justify-between items-center mb-6 w-full">
          <div className="text-5xl text-center  w-full">Tier List</div>
        </header>
        <div className="flex flex-col w-full space-y-4">
          {tierColors.map((color, tierIndex) => {
            console.log(`bg-gradient-to-r from-black to-${color}`);
            return (
              <div
                key={tierIndex}
                className={`flex flex-row min-h-40 max-h-fit  bg-gradient-to-r from-black ${color} p-2 rounded-md`}
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
