"use client";
import React, { useEffect, useState, useRef, useContext } from "react";
import { useRouter } from "next/navigation";
import SideBar from "@/components/SideBar";
import Card from "./Card";
import ReviewCard from "./ReviewCard";
import CastCard from "./CastCard";
import { motion } from "framer-motion";

interface Movie {
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
  const movieid = params?.movieid;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [backdrops, setBackdrops] = useState<Backdrop[]>([]);
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

  const truncateText = (text: string, wordLimit: number = 150) => {
    const words = text.split(/\s+/);
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + "...";
  };

  const postwatchlater = async (operation: string) => {
    setIsUpdating(true); // Disable the button
    const obj = {
      id: params.movieid,
      title: movie!.title,
      poster_path: movie!.poster_path,
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

  const postwatchhistory = async () => {
    const obj = {
      id: params.movieid,
      title: movie!.title,
      poster_path: movie!.poster_path,
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

  const postRanking = async (operation: string) => {
    setIsUpdatingcomp(true); // Disable the button
    const obj = {
      id: params.movieid,
      title: movie!.title,
      poster_path: movie!.poster_path,
      rating: 0,
      genres: movie!.genres,
    };
    try {
      const response = await fetch(`/api/updatedetails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "movie_ranking",
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

  useEffect(() => {
    if (movieid) {
      const fetchData = async () => {
        try {
          const response = await fetch(`/api/getmovie`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: movieid }),
          });

          const result = await response.json();

          const backdropsData = result.payload_images;
          const movieData = result.payload_data;
          const recc = result.payload_recc;
          const revs = result.payload_revs;
          const cast = result.payload_cast;
          setMovie(movieData);
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
  }, [movieid]);

  useEffect(() => {
    const getdata = async () => {
      try {
        const response = await fetch(`/api/getdata`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: movieid, from: "movie" }),
        });

        const result = await response.json();

        if (result.success) {
          console.log(result);
          if (result.watch_later) {
            setwid(true);
          } else {
            setwid(false);
          }

          if (result.ranking_movies === undefined) {
            setrank(null);
            setcid(false);
          } else {
            setrank(result.ranking_movies);
            setcid(true);
          }
        }
      } catch (err) {
        console.log(err);
      }
    };

    getdata();
  }, [movieid, wid, cid]);

  const handlescroll = () => {
    if (scrollToRef.current) {
      scrollToRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const handleclick = () => {
    !hid ? postwatchhistory() : null;
  };

  const handlecc = async () => {
    console.log("clickedd");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!movie) return <div>No movie data available</div>;

  return (
    <div className="flex flex-row justify-between relative">
      <SideBar />
      <div className="flex flex-col overflow-auto h-screen scrollbar scrollbar-track-transparent scrollbar-thumb-white">
        <div className="p-4 mt-6">
          <div className="mb-10 flex flex-col">
            <h1 className="text-3xl sm:text-3xl mb-5 font-semibold md:self-start self-center">
              {movie.title}
            </h1>
            <div className="flex flex-col sm:flex-row">
              {movie.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
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
                  <strong>Release Date:</strong> {movie.release_date}
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
                      <p className="mt-3 text-sm sm:text-base">
                        <strong>Your rating:</strong>{" "}
                        {rank
                          ? rank.rating === 0 ||
                            rank.rating === undefined ||
                            rank.rating === null
                            ? "Not Rated"
                            : rank.rating
                          : "Not Completed"}
                      </p>
                    ) : null}
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    onClick={handlescroll}
                    className="md:ml-10 mt-5 md:mt-0 border-2 border-white self-center p-2 rounded-lg text-xl cursor-pointer"
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
                          isUpdating ? "cursor-wait" : "cursor-pointer"
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
                          isUpdating ? "cursor-wait" : "cursor-pointer"
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
                            postRanking("remove");
                          }
                        }}
                        className={`md:ml-10 mt-5 md:mt-0 border-2 border-white self-center p-2 rounded-lg text-xl flex flex-row justify-between ${
                          isUpdatingcomp ? "cursor-wait" : "cursor-pointer"
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
                            postRanking("put");
                          }
                        }}
                        className={`md:ml-10 mt-5 md:mt-0 border-2 border-white self-center p-2 rounded-lg text-xl flex flex-row justify-between ${
                          isUpdatingcomp ? "cursor-wait" : "cursor-pointer"
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

          <div
            ref={scrollToRef}
            onClick={handlecc}
            className="h-[600px] w-full  mb-12"
          >
            {/*<iframe
              className="w-full h-full"
              src={`https://multiembed.mov/?video_id=${params.movieid}&tmdb=1`}
              allowFullScreen
            />*/}

            {
              <iframe
                className="w-full h-full"
                src={`https://vidsrc.xyz/embed/movie/${params.movieid}`}
                allowFullScreen
              />
            }
          </div>

          {reccomendation.length > 0 && (
            <div className="mb-10 flex flex-col">
              <h2 className="text-xl sm:text-2xl font-semibold mb-5">
                If you Liked '{movie.title}' then try:
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
