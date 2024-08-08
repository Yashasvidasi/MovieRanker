"use client";
import React, { useEffect, useRef, useState } from "react";
import SlideShowCard from "./SlideShowCard";
import { useAnimation } from "framer-motion";

const MovieSlideshow = () => {
  const [movies, setMovies] = useState<{ title: string }[]>([]);
  const [currentNumber, setCurrentNumber] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const referal = useRef(null);

  const fetchMovies = async () => {
    const response = await fetch(`/api/slideshow`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (response.status !== 500) {
      setMovies(data.payload);
      controlsbar.start({
        width: ["0", "100%"],
        transition: { duration: 5.8, ease: "easeIn" },
      });
      setIsLoading(false);
    } else {
      console.log("error");
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      controlsbar.start({
        width: ["0", "100%"],
        transition: { duration: 6, ease: "linear" },
      });
      setCurrentNumber((prevNumber) => (prevNumber + 1) % movies.length);
    }, 6000);

    return () => {
      clearInterval(interval);
    };
  }, [movies.length, currentNumber]);

  const controls = useAnimation();
  const controlsbar = useAnimation();

  useEffect(() => {
    controls.start({
      x: [-700, 0], // Start from 1000 and move to 0
      opacity: [0, 1], // Fade in effect
      transition: { duration: 0.5, ease: "easeInOut" },
    });
  }, [currentNumber, controls]);

  const getMovie = (number: number) => {
    if (movies.length !== 0) {
      return (
        movies[number] || (
          <div className="flex flex-col justify-center w-screen h-screen items-center mx-auto my-auto">
            <img className="w-96 h-96" src="/assets/PYh.gif" alt="" />
          </div>
        )
      );
    } else {
      return (
        <div className="flex flex-col justify-center w-screen h-screen items-center mx-auto my-auto">
          <img className="w-96 h-96" src="/assets/PYh.gif" alt="" />
        </div>
      );
    }
  };

  return (
    <div className="w-full h-full">
      {isLoading ? (
        <div className="flex flex-col justify-center w-screen z-50 items-center mx-auto my-auto">
          <img className="w-72 h-72" src="/assets/PYh.gif" alt="" />
          <div className="text-xl text-center text-white"> Loading </div>
        </div>
      ) : (
        <SlideShowCard
          ref={referal}
          data={getMovie(currentNumber)}
          controls={controls}
          controlsbar={controlsbar}
        />
      )}
    </div>
  );
};

export default MovieSlideshow;
