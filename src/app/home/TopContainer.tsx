"use client";
import React, { ReactNode, useContext, useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { AppContext } from "../AppContext";
import MovieSlideshow from "./MovieSlideshow";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface datatype {
  gender: any;
  id: any;
  first_air_date: ReactNode;
  name: string;
  title: string;
  overview: string;
  release_date: any;
  vote_count: any;
  popularity: any;
}

function TopContainer() {
  const [link, setlink] = useState("");
  const [data, setdata] = useState<datatype | null>(null);
  const { currentSelection, currentSelectiontype } = useContext(AppContext)!;

  const fetchdata = async () => {
    const response = await fetch(`/api/homeinfo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: currentSelectiontype,
        id: currentSelection,
      }),
    });
    const data = await response.json();
    if (data.payload !== null) setdata(data.payload);
  };

  const fetchtrailer = async () => {
    const response = await fetch(`/api/hometrailer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: currentSelectiontype,
        id: currentSelection,
      }),
    });
    const data = await response.json();
    if (data.payload !== null)
      setlink(`https://www.youtube.com/watch?v=${data.payload}`);
  };

  useEffect(() => {
    setdata(null);
    setlink("");
    if (currentSelection !== 0) {
      fetchtrailer();
      fetchdata();
    }
  }, [currentSelection, currentSelectiontype]);

  const router = useRouter();

  // Generate dynamic route for the Play button
  const generateRoute = () => {
    if (data?.name) {
      return data.gender ? `/person/${data.id}` : `/tv/${data.id}`;
    }
    return `/movie/${data?.id}`;
  };

  return (
    <div className="bg-black h-1/2 w-full text-white">
      {data ? (
        <>
          <div
            className="relative flex flex-col ml-7 mt-3 lg:w-1/2 h-5/12 overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white pr-3"
            style={{
              zIndex: 999,
            }}
          >
            <div className="lg:text-3xl text-lg mt-7">
              {data.title || data.name}
            </div>
            <div className="lg:text-base text-sm mt-5">{data.overview}</div>
            <div className="flex flex-row justify-start mt-3">
              <div className="flex flex-col text-white">
                <div className="lg:text-base text-sm">
                  RELEASE: {data.release_date}
                </div>
                <div className="lg:text-base text-sm mt-3">
                  RATING: {data.vote_count}
                </div>
                <div className="lg:text-base text-sm mt-3">
                  Popularity: {data.popularity}
                </div>
              </div>
              <div className="self-center ml-10 mt-3">
                <a href={generateRoute()} rel="noopener noreferrer">
                  <motion.div
                    whileHover={{ scale: 1.04 }}
                    className="p-2 hover:cursor-pointer border-2 border-white text-lg rounded-2xl flex flex-row"
                    onClick={(e) => {
                      e.preventDefault(); // Prevent default link behavior
                      router.push(generateRoute()); // Use SPA navigation
                    }}
                  >
                    <div className="self-center mr-1.5">
                      <img
                        className="h-5 w-5"
                        src="/assets/play.png"
                        style={{ filter: "invert(100%)" }}
                        alt="Play Icon"
                      />
                    </div>
                    <div className="self-center">Play</div>
                  </motion.div>
                </a>
              </div>
            </div>
          </div>
          <div
            className="hidden custom-md:flex -z-30"
            style={{
              position: "absolute",
              top: "3%",
              right: "7%",
              zIndex: 1,
              transform: "scale(1.18)", // Adjust scale for desired size
            }}
          >
            <ReactPlayer
              className="overflow-hidden"
              style={{
                zIndex: -1,
              }}
              url={link}
              playing={true}
              loop={true}
              volume={0}
              muted={true}
              config={{
                youtube: {
                  playerVars: {
                    autoplay: 1,
                    controls: 0,
                    autohide: 1,
                  },
                },
              }}
            />
            <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-l from-transparent to-black bg-opacity-10"></div>
          </div>
        </>
      ) : currentSelection === 0 ? (
        <MovieSlideshow />
      ) : null}
    </div>
  );
}

export default TopContainer;
