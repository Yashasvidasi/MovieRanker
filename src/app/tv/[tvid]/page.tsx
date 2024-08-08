"use client";
import React, { useEffect, useState, useRef, useContext } from "react";
import { useRouter } from "next/navigation";
import SideBar from "@/components/SideBar";
import Card from "./Card";
import ReviewCard from "./ReviewCard";
import CastCard from "./CastCard";
import { motion } from "framer-motion";

interface Movie {
  first_air_date: string;
  name: any;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  genres: { name: string }[];
  release_date: string;
  vote_average: number;
  vote_count: number;
}

interface Backdrop {
  file_path: string;
  vote_average: number;
}

const MoviePage = ({ params }: { params: any }) => {
  const tvid = params?.tvid;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [backdrops, setBackdrops] = useState<Backdrop[]>([]);
  const [localrate, setlocalrate] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reccomendation, setreccomendation] = useState([]);
  const [reviews, setreviews] = useState<any[]>([]);
  const [isReadMore, setIsReadMore] = useState(false);
  const [cast, setcast] = useState([]);
  const scrollToRef = useRef<HTMLDivElement>(null);
  const [wid, setwid] = useState(true);
  const [hid, sethid] = useState(true);
  const [cid, setcid] = useState(false);
  const [nid, setnid] = useState("");
  const [rank, setrank] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdatingcomp, setIsUpdatingcomp] = useState(false);
  const [season, setseason] = useState(1);
  const [episode, setepisode] = useState(1);
  const [totalseasons, settotalseasons] = useState<any[]>([]);

  const truncateText = (text: string, wordLimit: number = 150) => {
    const words = text.split(/\s+/);
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + "...";
  };

  const postwatchlater = async (operation: string) => {
    setIsUpdating(true); // Disable the button
    const obj = {
      id: params.tvid,
      title: movie!.name,
      poster_path: movie!.poster_path,
      otype: "tv",
    };
    try {
      const response = await fetch(`/api/updatedetails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "watch_later",
          object: obj,
          id: nid,
          operation: operation,
        }),
      });

      const result = await response.json();
      console.log(result, wid);
      if (result.success === true) {
        if (operation === "put") {
          setwid(true);
        } else {
          setwid(false);
        }
      } else {
        console.log("failed");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Error fetching data");
    } finally {
      setIsUpdating(false); // Enable the button
    }
  };

  const postwatchhistory = async (op: string) => {
    const obj = {
      id: params.tvid,
      title: movie!.name,
      poster_path: movie!.poster_path,
      otype: "tv",
    };
    try {
      const response = await fetch(`/api/updatedetails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "watch_history",
          object: obj,
          id: nid,
          operation: "put",
        }),
      });

      const result = await response.json();
      if (result.success) {
        sethid(false);
      } else {
        sethid(true);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Error fetching data");
    }
  };

  const postRanking = async (operation: string, rate: number) => {
    setIsUpdatingcomp(true); // Disable the button
    let gg: string[] = [];
    movie!.genres.forEach((item) => {
      gg.push(item.name);
    });
    const obj = {
      id: params.tvid,
      name: movie!.name,
      poster_path: movie!.poster_path,
      rating: rate,
      genres: gg,
    };
    try {
      const response = await fetch(`/api/updatedetails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "series_ranking",
          object: obj,
          id: nid,
          operation: operation,
        }),
      });

      const result = await response.json();

      if (result.success) {
        if (operation === "put") setcid(true);
        else {
          setcid(false);
        }
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Error fetching data");
    } finally {
      setIsUpdatingcomp(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await fetch(
        `/api/gettoken2?cachebuster=${new Date().getTime()}`,
        options
      );
      const data = await response.json();
      console.log(data);
      if (data.id !== "not_logged_in") {
        setnid(data.id);
      }
    };

    fetchData();
  }, []);

  const handleConfirm = () => {
    postRanking("update", localrate);
  };

  const handleRatingChange = (e: any) => {
    const value = e.target.value;

    // Parse the value to a number
    const numberValue = parseFloat(value);

    // Check if the value is a valid number and within the desired range
    if (!isNaN(numberValue)) {
      if (numberValue < 0) {
        setlocalrate(0);
      } else if (numberValue > 10) {
        setlocalrate(10);
      } else {
        setlocalrate(numberValue);
      }
    } else {
      // Handle non-numeric input gracefully if needed
      setlocalrate(0); // or setlocalrate(previousValidValue);
    }
  };

  useEffect(() => {
    if (tvid) {
      const fetchData = async () => {
        try {
          const response = await fetch(`/api/getseries`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: tvid }),
          });

          const result = await response.json();

          const backdropsData = result.payload_images;
          const movieData = result.payload_data;
          const recc = result.payload_recc;
          const revs = result.payload_revs;
          const cast = result.payload_cast;
          setMovie(movieData);
          settotalseasons(result.payload_data.seasons);
          setBackdrops(backdropsData);
          setreccomendation(recc);
          setreviews(revs);
          setcast(cast);
          console.log(revs);
        } catch (err) {
          console.error("Fetch Error:", err);
          setError("Error fetching data");
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [tvid]);

  useEffect(() => {
    const getdata = async () => {
      try {
        const response = await fetch(`/api/getdata`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: tvid, from: "series" }),
        });

        const result = await response.json();

        if (result.success) {
          console.log(result);
          if (result.watch_later) {
            setwid(true);
          } else {
            setwid(false);
          }

          if (result.ranking_series === undefined) {
            setrank(null);
            setcid(false);
          } else {
            setrank(result.ranking_series);
            setlocalrate(result.ranking_series.rating);
            setcid(true);
          }
        }
      } catch (err) {
        console.log(err);
      }
    };

    getdata();
  }, [tvid, wid, cid]);

  const handlescroll = () => {
    handlecc();
    if (scrollToRef.current) {
      scrollToRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const [showseasons, setshowseasons] = useState(false);
  const [showepisodes, setshowepisodes] = useState(false);

  const handlecc = () => {
    postwatchhistory("put");
  };

  if (loading)
    return (
      <div className="flex flex-col justify-center w-screen h-screen items-center mx-auto my-auto">
        <img className="w-96 h-96" src="/assets/PYh.gif" alt="" />
        <div className="text-xl"> Loading </div>
      </div>
    );
  if (error) return <div>{error}</div>;
  if (!movie) return <div>No movie data available</div>;

  return (
    <div className="flex flex-row justify-between relative">
      <SideBar />
      <div className="flex flex-col overflow-auto h-screen scrollbar scrollbar-track-transparent scrollbar-thumb-white">
        <div className="p-4 mt-6">
          <div className="mb-10 flex flex-col">
            <h1 className="text-3xl sm:text-3xl mb-5 font-semibold md:self-start self-center">
              {movie.name}
            </h1>
            <div className="flex flex-col sm:flex-row">
              {movie.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.name}
                  className="w-1/2 sm:w-64 h-64 self-center sm:h-fit object-cover mt-2 mb-4 sm:mb-0 sm:mr-10"
                />
              )}
              <div className="flex flex-col justify-start w-full">
                {movie.overview && (
                  <div>
                    <p className="text-sm sm:text-base">
                      {isReadMore
                        ? movie.overview
                        : truncateText(movie.overview, 70)}
                    </p>
                    {movie.overview.length < 70 ? (
                      <button
                        onClick={() => setIsReadMore(!isReadMore)}
                        className="text-blue-500 mb-3 mt-2 text-xs sm:text-sm"
                      >
                        {isReadMore ? "Read Less" : "Read More"}
                      </button>
                    ) : null}
                  </div>
                )}
                <p className="mt-3 text-sm sm:text-base">
                  <strong>First Aired:</strong> {movie.first_air_date}
                </p>
                <p className="mt-3 text-sm sm:text-base">
                  <strong>Genres:</strong>{" "}
                  {movie.genres.map((genre) => genre.name).join(", ")}
                </p>
                <div className="mt-3 flex flex-col md:flex-row justify-start">
                  <div className="flex flex-col">
                    <p className=" text-sm sm:text-base">
                      <strong>Vote Average:</strong> {movie.vote_average}
                    </p>
                    <p className="mt-3 text-sm sm:text-base">
                      <strong>Vote Count:</strong> {movie.vote_count}
                    </p>
                    {nid ? (
                      <div className="mt-3 text-sm sm:text-base">
                        {rank ? (
                          <div>
                            <strong>Your rating:</strong>{" "}
                            <input
                              type="number"
                              min="0"
                              max="10"
                              step="0.1"
                              value={localrate || ""}
                              onChange={handleRatingChange}
                              className="border border-gray-300 rounded text-black p-1"
                            />
                            <button
                              onClick={handleConfirm} // Implement this to handle the confirm action
                              className="ml-2 bg-blue-500 text-white p-1 rounded"
                            >
                              Confirm
                            </button>
                          </div>
                        ) : (
                          "Not Completed"
                        )}
                      </div>
                    ) : null}
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    onClick={handlescroll}
                    className="md:ml-10 mt-5 md:mt-0 border-2 border-white self-center p-2 rounded-lg text-xl hover:cursor-pointer"
                  >
                    Watch Now
                  </motion.div>
                  {nid ? (
                    wid ? (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        onClick={() => {
                          if (!isUpdating) {
                            postwatchlater("remove");
                          }
                        }}
                        className={`md:ml-10 mt-5 md:mt-0 border-2 border-white self-center p-2 rounded-lg text-xl flex flex-row justify-between ${
                          isUpdating ? "cursor-wait" : "hover:cursor-pointer"
                        }`}
                      >
                        <p className="self-center">Remove from watch later</p>
                        <img
                          src="/assets/minus-button.png"
                          alt=""
                          className="w-5 h-5 self-center mt-0.5 ml-4"
                          style={{
                            filter: "invert(100%)",
                          }}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        onClick={() => {
                          if (!isUpdating) {
                            postwatchlater("put");
                          }
                        }}
                        className={`md:ml-10 mt-5 md:mt-0 border-2 border-white self-center p-2 rounded-lg text-xl flex flex-row justify-between ${
                          isUpdating ? "cursor-wait" : "hover:cursor-pointer"
                        }`}
                      >
                        <p>Save to Watch Later</p>
                        <img
                          src="/assets/clock.png"
                          alt=""
                          className="w-5 h-5 self-center mt-0.5 ml-4"
                          style={{
                            filter: "invert(100%)",
                          }}
                        />
                      </motion.div>
                    )
                  ) : null}
                  {nid ? (
                    cid ? (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        onClick={() => {
                          if (!isUpdatingcomp) {
                            postRanking("remove", 0);
                          }
                        }}
                        className={`md:ml-10 mt-5 md:mt-0 border-2 border-white self-center p-2 rounded-lg text-xl flex flex-row justify-between ${
                          isUpdatingcomp
                            ? "cursor-wait"
                            : "hover:cursor-pointer"
                        }`}
                      >
                        <p>Completed</p>
                        <img
                          src="/assets/checked.png"
                          alt=""
                          className="w-5 h-5 self-center mt-0.5 ml-4"
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        onClick={() => {
                          if (!isUpdatingcomp) {
                            postRanking("put", 0);
                          }
                        }}
                        className={`md:ml-10 mt-5 md:mt-0 border-2 border-white self-center p-2 rounded-lg text-xl flex flex-row justify-between ${
                          isUpdatingcomp
                            ? "cursor-wait"
                            : "hover:cursor-pointer"
                        }`}
                      >
                        <p>Not Completed</p>
                        <img
                          src="/assets/delete.png"
                          alt=""
                          className="w-5 h-5 self-center mt-0.5 ml-4"
                        />
                      </motion.div>
                    )
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          {cast.length > 0 && (
            <div className="mb-10 flex flex-col">
              <h2 className="text-xl sm:text-2xl font-semibold mb-5">Cast</h2>
              <div className="p-2 flex flex-row overflow-x-auto gap-3 h-fit pb-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white">
                {cast.map((item, index) => (
                  <CastCard key={index} data={item} />
                ))}
              </div>
            </div>
          )}

          {backdrops.length > 0 && (
            <div className="mb-16 flex flex-col">
              <h2 className="text-xl sm:text-2xl font-semibold mb-5">Images</h2>
              <div className="flex flex-row flex-wrap gap-3">
                {backdrops.slice(0, 10).map((backdrop, index) => (
                  <img
                    key={index}
                    src={`https://image.tmdb.org/t/p/w500${backdrop.file_path}`}
                    alt={`Backdrop ${index}`}
                    className="w-fit h-20 md:h-32 object-contain"
                  />
                ))}
              </div>
            </div>
          )}

          <div ref={scrollToRef} className="h-[600px] w-full  mb-12">
            {
              <iframe
                className="w-full h-full"
                src={`https://vidsrc.xyz/embed/tv/${params.tvid}/${season}/${episode}`}
                allowFullScreen
              />
            }
          </div>

          <div className="relative flex flex-row mb-10">
            {/* Season Selector */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ease: "easeOut", duration: 0.3 }}
              className="flex flex-col rounded-lg shadow-lg"
            >
              <div
                className="hover:cursor-pointer text-xl rounded-lg font-semibold hover:text-blue-500 border border-white p-2"
                onClick={() => setshowseasons(!showseasons)}
              >
                Season: {totalseasons[season].name}
              </div>
              {showseasons && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ ease: "easeOut", duration: 0.3 }}
                  className="mt-2 flex flex-col rounded-lg p-2 shadow-inner absolute z-50 bg-slate-700 top-14 h-60 overflow-auto scrollbar-thin scrollbar-track-transparent"
                >
                  {totalseasons.map((item, index) => (
                    <div
                      key={index}
                      className="hover:cursor-pointer hover:bg-slate-950 p-3 bg-slate-700 rounded text-lg"
                      onClick={() => {
                        setseason(index);
                        setshowseasons(false);
                        setshowepisodes(true); // Show episodes when season is selected
                      }}
                    >
                      {item.name}
                    </div>
                  ))}
                </motion.div>
              )}
            </motion.div>

            {/* Episode Selector */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ease: "easeOut", duration: 0.3 }}
              className="flex flex-col rounded-lg shadow-lg ml-10"
            >
              <div
                className="hover:cursor-pointer text-xl rounded-lg font-semibold hover:text-blue-500 border border-white p-2"
                onClick={() => setshowepisodes(!showepisodes)}
              >
                Episode: {episode}
              </div>
              {showepisodes && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ ease: "easeOut", duration: 0.3 }}
                  className="mt-2 flex flex-col rounded-lg p-2 shadow-inner absolute z-50 bg-slate-700 top-14 h-60 overflow-auto scrollbar-thin scrollbar-track-transparent"
                >
                  {Array.from(
                    { length: totalseasons[season].episode_count },
                    (_, index) => (
                      <div
                        key={index}
                        className="hover:cursor-pointer hover:bg-slate-950 p-3 bg-slate-700 rounded text-lg"
                        onClick={() => {
                          setepisode(index + 1);
                          setshowepisodes(false);
                        }}
                      >
                        Episode: {index + 1}
                      </div>
                    )
                  )}
                </motion.div>
              )}
            </motion.div>
          </div>

          {reccomendation.length > 0 && (
            <div className="mb-10 flex flex-col">
              <h2 className="text-xl sm:text-2xl font-semibold mb-5">
                If you Liked '{movie.name}' then try:
              </h2>
              <div className="flex flex-row flex-wrap gap-3">
                {reccomendation.map((item, index) => (
                  <Card key={index} data={item} />
                ))}
              </div>
            </div>
          )}
          {reviews.length > 0 && (
            <div className="mb-10 flex flex-col">
              <h2 className="text-xl sm:text-2xl font-semibold mb-5">
                Reviews:
              </h2>
              <div className="flex flex-row flex-wrap gap-6">
                {reviews.map((item, index) => {
                  if (item !== undefined)
                    return <ReviewCard key={index} data={item} />;
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className=""></div>
    </div>
  );
};

export default MoviePage;
