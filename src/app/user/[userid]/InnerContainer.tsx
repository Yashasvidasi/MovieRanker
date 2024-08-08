"use client";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState, useRef } from "react";
import { UserContext } from "./UserContext";
import SideBar from "@/components/SideBar";
import MovieCard from "./moviecard"; // Import the MovieCard component

import {
  FaFilm,
  FaTv,
  FaClock,
  FaHistory,
  FaStar,
  FaSignOutAlt,
  FaArrowRight,
  FaArrowLeft,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { FaRankingStar } from "react-icons/fa6";
import ActorCard from "./actorcard";
import GenreChart from "./GenreChart";

const InnerContainer = ({ params }: { params: any }) => {
  const router = useRouter();
  const [name, setName] = useState("");

  const {
    watchlater,
    setwatchlater,
    watchhistory,
    setwatchhistory,
    favorites,
    setfavorites,
    movieranking,
    setmovieranking,
    seriesranking,
    setseriesranking,
    searchhistory,
    setsearchhistory,
  } = useContext(UserContext)!;

  const handlelogout = async () => {
    try {
      const response = await fetch(`/api/logout`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.success === true) {
        setTimeout(() => {
          router.replace("/login");
        }, 100);
      }
    } catch (err) {}
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
        setName(data.name);
        setfavorites(data.favorite_actors);
        setwatchhistory(data.watch_history);
        setwatchlater(data.watch_later);
        setmovieranking(data.movie_ranking);
        setseriesranking(data.series_ranking);
      }
    } catch (err) {
      //try again 3 times
    }
  };

  useEffect(() => {
    handleget();
  }, []);

  useEffect(() => {
    console.log(">>>>>", favorites);
  }, [favorites]);

  // Sorting functions and limiting to top 10
  const sortedMovieRanking = movieranking
    ?.sort((a, b) => b.rating - a.rating)
    .slice(0, 10);
  const sortedSeriesRanking = seriesranking
    ?.sort((a, b) => b.rating - a.rating)
    .slice(0, 10);

  // Refs for scroll containers
  const watchLaterRef = useRef<HTMLDivElement>(null);
  const watchHistoryRef = useRef<HTMLDivElement>(null);
  const favoritesRef = useRef<HTMLDivElement>(null);

  const scrollLeft = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollBy({ left: -600, behavior: "smooth" });
    }
  };

  const scrollRight = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollBy({ left: 600, behavior: "smooth" });
    }
  };

  return (
    <div className="flex bg-black text-white h-screen overflow-hidden">
      <SideBar />
      <div className="flex flex-col w-full py-10 px-6 overflow-auto scrollbar scrollbar-track-transparent scrollbar-thumb-white">
        <div className="flex md:flex-row flex-col justify-between items-center mb-6">
          <div className="text-3xl font-bold">UserName: {name}</div>
          <button
            onClick={handlelogout}
            className="flex items-center text-xl text-red-500 md:mt-0 mt-8"
          >
            <FaSignOutAlt className="mr-2" />
            Logout
          </button>
        </div>
        <div className="flex flex-col gap-6">
          <div className="bg-gray-900 flex flex-row justify-evenly p-6 rounded-lg shadow-md">
            <div className="bg-gray-900 flex flex-col justify-between  p-6 rounded-lg shadow-md">
              <FaFilm className="text-3xl text-blue-500 mb-4 self-center" />
              <div className="text-2xl font-semibold mb-2">Movies Watched</div>
              <div className="text-xl self-center text-center">
                {movieranking ? movieranking.length : null}
              </div>
            </div>
            <div className="bg-gray-900 flex flex-col justify-between  p-6 rounded-lg shadow-md">
              <FaTv className="text-3xl text-green-500 mb-4 self-center" />
              <div className="text-2xl font-semibold mb-2">Series Watched</div>
              <div className="text-xl self-center text-center">
                {seriesranking ? seriesranking.length : null}
              </div>
            </div>
          </div>

          {/* Watch later Section */}
          <div className="bg-gray-900 p-6 w-full rounded-lg shadow-md">
            <FaHistory className="text-3xl text-pink-500 mb-4" />
            <div className="text-2xl font-semibold mb-3">
              Watch Later: {watchlater.length}
            </div>
            <div className="relative h-64 flex flex-row">
              <motion.div
                onClick={() => {
                  scrollLeft(watchLaterRef);
                }}
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.98 }}
                className="absolute hover:cursor-pointer h-52 mt-8 w-16 rounded-r-full bg-opacity-15 hover:bg-opacity-30 flex flex-col justify-center bg-white z-10  px-10"
              >
                <img
                  className="self-center mr-5 min-w-16 h-16 opacity-60"
                  style={{ filter: "invert(100%)" }}
                  src={"/assets/arrowl.png"}
                  alt=""
                />
              </motion.div>
              <div
                ref={watchLaterRef}
                className="flex flex-row space-x-4 overflow-x-scroll scroll-smooth scrollbar-thin scrollbar-track-transparent scrollbar-thumb-transparent"
              >
                {watchlater?.map((item, index) => (
                  <MovieCard key={index} data={item} />
                ))}
              </div>
              <motion.div
                onClick={() => {
                  scrollRight(watchLaterRef);
                }}
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.98 }}
                className="absolute right-0 hover:cursor-pointer h-52 mt-8 w-16 rounded-l-full bg-opacity-15 hover:bg-opacity-30 flex flex-col justify-center bg-white z-10  px-10"
              >
                <img
                  className="self-center ml-4 min-w-16 h-16 opacity-60"
                  style={{ filter: "invert(100%)" }}
                  src={"/assets/arrowr.png"}
                  alt=""
                />
              </motion.div>
            </div>
          </div>

          {/* Watch History Section */}
          <div className="bg-gray-900 p-6 w-full rounded-lg shadow-md">
            <FaHistory className="text-3xl text-purple-500 mb-4" />
            <div className="text-2xl font-semibold mb-3">
              Watch History: {watchhistory.length}
            </div>
            <div className="relative h-64 flex flex-row">
              <motion.div
                onClick={() => {
                  scrollLeft(watchHistoryRef);
                }}
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.98 }}
                className="absolute hover:cursor-pointer h-52 mt-8 w-16 rounded-r-full bg-opacity-15 hover:bg-opacity-30 flex flex-col justify-center bg-white z-10  px-10"
              >
                <img
                  className="self-center mr-5 min-w-16 h-16 opacity-60"
                  style={{ filter: "invert(100%)" }}
                  src={"/assets/arrowl.png"}
                  alt=""
                />
              </motion.div>
              <div
                ref={watchHistoryRef}
                className="flex flex-row space-x-4 overflow-x-scroll scroll-smooth scrollbar-thin scrollbar-track-transparent scrollbar-thumb-transparent"
              >
                {watchhistory?.map((item, index) => (
                  <MovieCard key={index} data={item} />
                ))}
              </div>
              <motion.div
                onClick={() => {
                  scrollRight(watchHistoryRef);
                }}
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.98 }}
                className="absolute right-0 hover:cursor-pointer h-52 mt-8 w-16 rounded-l-full bg-opacity-15 hover:bg-opacity-30 flex flex-col justify-center bg-white z-10  px-10"
              >
                <img
                  className="self-center ml-4 min-w-16 h-16 opacity-60"
                  style={{ filter: "invert(100%)" }}
                  src={"/assets/arrowr.png"}
                  alt=""
                />
              </motion.div>
            </div>
          </div>

          {/* Favorites Section */}
          <div className="bg-gray-900 p-6 w-full rounded-lg shadow-md">
            <FaStar className="text-3xl text-red-500 mb-4" />
            <div className="text-2xl font-semibold mb-3">
              Favorite Actors: {favorites.length}
            </div>
            <div className="relative h-fit min-h-64 flex flex-row">
              <motion.div
                onClick={() => {
                  scrollLeft(favoritesRef);
                }}
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.98 }}
                className="absolute hover:cursor-pointer h-52 mt-8 w-16 rounded-r-full bg-opacity-15 hover:bg-opacity-30 flex flex-col justify-center bg-white z-10  px-10"
              >
                <img
                  className="self-center mr-5 min-w-16 h-16 opacity-60"
                  style={{ filter: "invert(100%)" }}
                  src={"/assets/arrowl.png"}
                  alt=""
                />
              </motion.div>
              <div
                ref={favoritesRef}
                className="flex flex-row space-x-4 overflow-x-scroll scroll-smooth scrollbar-thin scrollbar-track-transparent scrollbar-thumb-transparent"
              >
                {favorites?.map((item, index) => (
                  <ActorCard key={index} data={item} />
                ))}
              </div>
              <motion.div
                onClick={() => {
                  scrollRight(favoritesRef);
                }}
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.98 }}
                className="absolute right-0 hover:cursor-pointer h-52 mt-8 w-16 rounded-l-full bg-opacity-15 hover:bg-opacity-30 flex flex-col justify-center bg-white z-10  px-10"
              >
                <img
                  className="self-center ml-4 min-w-16 h-16 opacity-60"
                  style={{ filter: "invert(100%)" }}
                  src={"/assets/arrowr.png"}
                  alt=""
                />
              </motion.div>
            </div>
          </div>

          {/* Movie Ranking Section */}
          <div className="bg-gray-900 flex md:flex-row flex-col justify-between rounded-lg">
            <div className="bg-gray-900 w-full p-6 rounded-lg shadow-md col-span-2">
              <FaRankingStar className="text-3xl text-yellow-500 mb-4" />
              <div className="flex flex-row justify-between">
                <div className="text-xl md:text-2xl font-semibold">
                  Top 10 Movies:
                </div>
                <motion.div
                  className="text-xl font-semibold flex flex-row justify-between hover:cursor-pointer"
                  onClick={() => {
                    router.push(`/user/${params}/rankingmovies`);
                  }}
                  whileHover={{
                    scale: 1.06,
                  }}
                >
                  <p>Tier List</p>
                  <FaArrowRight className="self-center ml-3" />
                </motion.div>
              </div>
              <ul className="text-xl flex flex-col space-y-4 py-7">
                {sortedMovieRanking?.map((item, index) => (
                  <motion.div
                    onClick={() => {
                      router.push(`/movie/${item.id}`);
                    }}
                    whileHover={{
                      scale: 1.04,
                    }}
                    className="w-full hover:cursor-pointer bg-slate-950 h-24 flex flex-row justify-between shadow-md p-2 shadow-black pt-3 rounded-lg"
                    key={index}
                  >
                    <div className="flex flex-row">
                      <img
                        src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                        alt=""
                      />
                      <div className="ml-3">{item.title}</div>
                    </div>
                    {/* Placeholder for slider to set the rating */}
                    <div className="text-nowrap self-end mb-3 mr-5">
                      Rating: {item.rating === 0 ? "Not Rated" : item.rating}
                    </div>
                  </motion.div>
                ))}
              </ul>
            </div>

            {/* Series Ranking Section */}
            <div className="bg-gray-900 p-6 w-full rounded-lg shadow-md col-span-2">
              <FaRankingStar className="text-3xl text-yellow-500 mb-4" />
              <div className="flex flex-row justify-between">
                <div className="text-xl md:text-2xl font-semibold">
                  Top 10 Series:
                </div>
                <motion.div
                  className="text-xl font-semibold flex flex-row justify-between hover:cursor-pointer"
                  onClick={() => {
                    router.push(`/user/${params}/rankingseries`);
                  }}
                  whileHover={{
                    scale: 1.06,
                  }}
                >
                  <p>Tier List</p>
                  <FaArrowRight className="self-center ml-3" />
                </motion.div>
              </div>
              <ul className="text-xl flex flex-col space-y-4 py-7">
                {sortedSeriesRanking?.map((item, index) => (
                  <motion.div
                    onClick={() => {
                      router.push(`/tv/${item.id}`);
                    }}
                    whileHover={{
                      scale: 1.04,
                    }}
                    className="w-full hover:cursor-pointer bg-slate-950 h-24 flex flex-row justify-between shadow-md p-2 shadow-black pt-3 rounded-lg"
                    key={index}
                  >
                    <div className="flex flex-row">
                      <img
                        src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                        alt=""
                      />
                      <div className="ml-3">{item.name}</div>
                    </div>
                    {/* Placeholder for slider to set the rating */}
                    <div className="text-nowrap self-end mb-3 mr-5">
                      Rating: {item.rating === 0 ? "Not Rated" : item.rating}
                    </div>
                  </motion.div>
                ))}
              </ul>
            </div>
          </div>
          <div className="bg-gray-900 flex flex-col justify-center items-center rounded-lg mt-10 py-10 w-full">
            <div className="text-5xl mt-2 mb-10">STATISTICS</div>
            <GenreChart
              movieRanking={movieranking}
              seriesRanking={seriesranking}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InnerContainer;
