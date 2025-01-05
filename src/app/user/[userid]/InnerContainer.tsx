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
          <div className="flex flex-row gap-6 w-full">
            {/* Movie Rankings Container */}
            <div className="flex-1 bg-gray-900 p-6 rounded-lg shadow-md">
              <div
                className="flex items-center gap-2 hover:cursor-pointer mb-9"
                onClick={() => {
                  router.push(`/user/${params}/rankingmovies`);
                }}
              >
                <FaRankingStar className="text-3xl text-yellow-500" />
                <h2 className="text-2xl font-semibold">Top Movies</h2>
              </div>

              <div className="flex flex-col gap-4">
                {sortedMovieRanking?.map((item, index) => (
                  <a
                    key={index}
                    href={`/movie/${item.id}`}
                    className="w-full bg-slate-950 h-24 rounded-lg shadow-md shadow-black flex items-center justify-between p-4 hover:bg-slate-900 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                        alt={item.title}
                        className="h-16 w-auto object-cover"
                      />
                      <span className="font-medium">
                        {truncatetext(item.title)}
                      </span>
                    </div>
                    <span className="text-nowrap">
                      Rating: {item.rating === 0 ? "Not Rated" : item.rating}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Series Rankings Container */}
            <div className="flex-1 bg-gray-900 p-6 rounded-lg shadow-md">
              <div
                className="flex items-center gap-2 mb-9 hover:cursor-pointer "
                onClick={() => {
                  router.push(`/user/${params}/rankingmovies`);
                }}
              >
                <FaRankingStar className="text-3xl text-blue-500" />
                <h2 className="text-2xl font-semibold">Top Series</h2>
              </div>

              <div className="flex flex-col gap-4">
                {sortedSeriesRanking?.map((item, index) => (
                  <a
                    key={index}
                    href={`/tv/${item.id}`}
                    className="w-full bg-slate-950 h-24 rounded-lg shadow-md shadow-black flex items-center justify-between p-4 hover:bg-slate-900 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                        alt={item.name}
                        className="h-16 w-auto object-cover"
                      />
                      <span className="font-medium">
                        {truncatetext(item.name)}
                      </span>
                    </div>
                    <span className="text-nowrap">
                      Rating: {item.rating === 0 ? "Not Rated" : item.rating}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InnerContainer;
