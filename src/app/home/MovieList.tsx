"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import CorouselIndex from "./CorouselIndex";
import { AppContext } from "../AppContext";
import corouselindex from "@/constants";
import { motion, useAnimation } from "framer-motion";
import MovieCard from "./moviecard";
import { useInView } from "react-intersection-observer";

const MovieList = () => {
  const { listType } = useContext(AppContext)!;
  const [PopularMoviePage, setPopularMoviePage] = useState(1);
  const [NewMoviePage, setNewMoviePage] = useState(1);
  const [TopMoviePage, setTopMoviePage] = useState(1);
  const [PopularSeriesPage, setPopularSeriesPage] = useState(1);
  const [NewSeriesPage, setNewSeriesPage] = useState(1);
  const [TopSeriesPage, setTopSeriesPage] = useState(1);

  const [PopularMovie, setPopularMovie] = useState<any[]>([]);
  const [NewMovie, setNewMovie] = useState<any[]>([]);
  const [TopMovie, setTopMovie] = useState<any[]>([]);
  const [PopularSeries, setPopularSeries] = useState<any[]>([]);
  const [NewSeries, setNewSeries] = useState<any[]>([]);
  const [TopSeries, setTopSeries] = useState<any[]>([]);
  const { ref, inView } = useInView({ threshold: 0.5 });
  const { allmovies, setallmovies } = useContext(AppContext)!;

  const fetchone = async (uri: string, page: number, retries = 3) => {
    try {
      const response = await fetch(`/api/homemovies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uri, page }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();
      return data.payload;
    } catch (err: any) {
      if (retries > 0) {
        console.log(`Retrying... (${3 - retries + 1})`);
        return fetchone(uri, page, retries - 1);
      } else {
        console.log(err);
        throw err;
      }
    }
  };

  const addUniqueItems = (prevList: any[], newItems: any[]) => {
    const newItemsSet = new Set(newItems.map((item) => item.id)); // Adjust based on unique property
    return [
      ...prevList.filter((item) => !newItemsSet.has(item.id)),
      ...newItems,
    ];
  };

  const updateList = (
    listType: any,
    data: { results: any[] },
    page: React.SetStateAction<number>
  ) => {
    if (data && data.results) {
      switch (listType) {
        case 1:
          setPopularMovie((prev) => addUniqueItems(prev, data.results));
          setPopularMoviePage(page);
          break;
        case 2:
          setPopularSeries((prev) => addUniqueItems(prev, data.results));
          setPopularSeriesPage(page);
          break;
        case 3:
          setNewMovie((prev) => addUniqueItems(prev, data.results));
          setNewMoviePage(page);
          break;
        case 4:
          setNewSeries((prev) => addUniqueItems(prev, data.results));
          setNewSeriesPage(page);
          break;
        case 5:
          setTopMovie((prev) => addUniqueItems(prev, data.results));
          setTopMoviePage(page);
          break;
        case 6:
          setTopSeries((prev) => addUniqueItems(prev, data.results));
          setTopSeriesPage(page);
          break;
        default:
          console.warn("Unknown listType:", listType);
          break;
      }
    }
  };

  const fetchmore = async (page: number) => {
    const item = corouselindex.find((item) => item.index === listType);
    if (item) {
      const data = await fetchone(item.url, page);

      if (data && data.results) {
        updateList(listType, data, page);
      }
    }
  };

  const fetchall = async () => {
    corouselindex.forEach(async (item) => {
      const data = await fetchone(item.url, 1);
      switch (item.index) {
        case 1:
          setPopularMovie(data.results);
          setallmovies(data.results);
          controls2.start({
            y: [300, 0], // Start from 300 and move to 0
            opacity: [0, 1], // Fade in effect
            transition: { duration: 0.5, ease: "easeIn" },
          });
          break;
        case 2:
          setPopularSeries(data.results);
          break;
        case 3:
          setNewMovie(data.results);
          break;
        case 4:
          setNewSeries(data.results);
          break;
        case 5:
          setTopMovie(data.results);
          break;

        default:
          setTopSeries(data.results);
          break;
      }
    });
  };

  useEffect(() => {
    fetchall();
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -600, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 600, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (listType === 1) {
      setallmovies(PopularMovie);
    } else if (listType === 2) {
      setallmovies(PopularSeries);
    } else if (listType === 3) {
      setallmovies(NewMovie);
    } else if (listType === 4) {
      setallmovies(NewSeries);
    } else if (listType === 5) {
      setallmovies(TopMovie);
    } else if (listType === 6) {
      setallmovies(TopSeries);
    }
  }, [PopularMovie, PopularSeries, TopMovie, TopSeries, NewSeries, NewMovie]);

  useEffect(() => {
    if (listType === 1) {
      setallmovies(PopularMovie);
    } else if (listType === 2) {
      setallmovies(PopularSeries);
    } else if (listType === 3) {
      setallmovies(NewMovie);
    } else if (listType === 4) {
      setallmovies(NewSeries);
    } else if (listType === 5) {
      setallmovies(TopMovie);
    } else if (listType === 6) {
      setallmovies(TopSeries);
    }
    controls2.start({
      y: [300, 0], // Start from 300 and move to 0
      opacity: [0, 1], // Fade in effect
      transition: { duration: 0.5, ease: "easeIn" },
    });
    containerRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  }, [listType]);

  const controls2 = useAnimation();

  const increasepage = () => {
    //if 'fifthref' is visible then call this function
    let nextPage;
    switch (listType) {
      case 1:
        nextPage = PopularMoviePage + 1;
        break;
      case 2:
        nextPage = PopularSeriesPage + 1;
        break;
      case 3:
        nextPage = NewMoviePage + 1;
        break;
      case 4:
        nextPage = NewSeriesPage + 1;
        break;
      case 5:
        nextPage = TopMoviePage + 1;
        break;
      case 6:
        nextPage = TopSeriesPage + 1;
        break;
    }
    fetchmore(nextPage!);
  };

  useEffect(() => {
    if (inView) {
      console.log("inview");
      increasepage();
    }
  }, [inView]);

  return (
    <div className="w-full h-full flex flex-col ">
      <CorouselIndex />
      <div className="relative flex flex-row mt-3">
        <motion.div
          onClick={scrollLeft}
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
        <motion.div
          ref={containerRef}
          initial={{ y: 1300 }}
          animate={controls2}
          className="my-3 w-full h-[27rem] mb-2 flex flex-row  overflow-hidden space-x-5 hover:overflow-x-scroll  scroll-smooth no-scrollbar"
        >
          {allmovies.map((item, index) => (
            <MovieCard key={item.id} data={item} />
          ))}
          <div ref={ref}></div>
        </motion.div>
        <motion.div
          onClick={scrollRight}
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
  );
};

export default MovieList;
