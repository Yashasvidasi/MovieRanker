"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SideBar from "@/components/SideBar";
import { motion } from "framer-motion";
import Card from "./Card";

interface Personal {
  birthday: string;
  biography: string;
  birthdate: string;
  deathday: string | null;
  place_of_birth: string;
  name: string;
  profile_path: string;
}

interface Image {
  file_path: string;
}

interface Movie {
  id: number;
  title: string;
  release_date: string;
  poster_path: string;
  gender: any;
  profile_path: any;
  name: any;
}

interface TVShow {
  id: number;
  title: string;
  first_air_date: string;
  poster_path: string;
  gender: any;
  profile_path: any;
  name: any;
}

const ActorPage = ({ params }: { params: any }) => {
  const pid = params?.pid; // Adjusted to safely get pid
  const [movies, setMovies] = useState<Movie[]>([]);
  const [personalData, setPersonalData] = useState<Personal | null>(null);
  const [images, setImages] = useState<Image[]>([]);
  const [tvShows, setTvShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isReadMore, setIsReadMore] = useState(false);
  const [nid, setnid] = useState(false);
  const [fid, setfid] = useState(false);
  const [IsUpdating, setIsUpdating] = useState(false);

  const truncateText = (text: string, wordLimit: number = 150) => {
    const words = text.split(/\s+/); // Split the text into words
    if (words.length <= wordLimit) return text; // If there are fewer words than the limit, return the full text
    return words.slice(0, wordLimit).join(" ") + "..."; // Otherwise, join the first `wordLimit` words and add ellipses
  };

  useEffect(() => {
    if (pid) {
      const fetchData = async () => {
        try {
          const response = await fetch(`/api/getperson`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: pid }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();

          const images = result.payload_images;
          const personalData = result.payload_data;
          const movies = result.payload_movies;
          const tvShows = result.payload_tv;

          setImages(images);
          setPersonalData(personalData);
          setMovies(movies);
          setTvShows(tvShows);
          console.log(personalData);
        } catch (err) {
          console.error("Fetch Error:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, []);

  const postfavorite = async (operation: string) => {
    setIsUpdating(true); // Disable the button
    const obj = {
      id: params.pid,
      name: personalData!.name,
      profile_path: personalData!.profile_path,
    };
    try {
      const response = await fetch(`/api/updatedetails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "favorite_actor",
          object: obj,
          id: nid,
          operation: operation,
        }),
      });

      const result = await response.json();
      console.log(result, fid);
      if (result.success === true) {
        if (operation === "put") {
          setfid(true);
        } else {
          setfid(false);
        }
      } else {
        console.log("failed");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setIsUpdating(false); // Enable the button
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
    const getdata = async () => {
      try {
        const response = await fetch(`/api/getdata`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: pid, from: "person" }),
        });

        const result = await response.json();

        if (result.success) {
          console.log(result);
          if (result.favorite_actor) {
            setfid(true);
          } else {
            setfid(false);
          }
        }
      } catch (err) {
        console.log(err);
      }
    };

    getdata();
  }, [pid, fid]);

  if (loading)
    return (
      <div className="flex flex-col justify-center w-screen h-screen items-center mx-auto my-auto">
        <img className="w-96 h-96" src="/assets/PYh.gif" alt="" />
      </div>
    );
  if (!personalData) return <div>No personal data available</div>;

  return (
    <div className="flex flex-row justify-between relative">
      <SideBar />
      <div className="flex flex-col overflow-auto h-screen scrollbar scrollbar-track-transparent scrollbar-thumb-white">
        <div className="p-4 mt-6">
          <div className="mb-10 flex flex-col">
            <div className="flex flex-col justify-start w-full mb-1">
              <h1 className="text-2xl sm:text-3xl mb-3 font-semibold">
                {personalData.name}
              </h1>
            </div>
            <div className="flex flex-col sm:flex-row">
              {personalData.profile_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w500${personalData.profile_path}`}
                  alt={personalData.name}
                  className="w-1/2 sm:w-64 h-fit self-center md:self-start sm:h-64 object-cover mt-2 mb-4 sm:mb-0 sm:mr-10"
                />
              )}
              <div className="flex flex-col justify-start w-full">
                {personalData.biography && (
                  <div>
                    <p className="text-sm sm:text-base">
                      {isReadMore
                        ? personalData.biography
                        : truncateText(personalData.biography)}
                    </p>
                    {personalData.biography.length > 70 && (
                      <button
                        onClick={() => setIsReadMore(!isReadMore)}
                        className="text-blue-500 mt-2 text-xs sm:text-sm"
                      >
                        {isReadMore ? "Read Less" : "Read More"}
                      </button>
                    )}
                  </div>
                )}
                <div className="mt-3 flex md:flex-row flex-col">
                  <div className="flex flex-col">
                    <p className="text-sm sm:text-base">
                      <strong>Born:</strong> {personalData.birthday}
                    </p>
                    <p className="text-sm sm:text-base">
                      <strong>Place of Birth:</strong>{" "}
                      {personalData.place_of_birth}
                    </p>
                    {personalData.deathday && (
                      <p className="text-sm sm:text-base">
                        <strong>Death:</strong> {personalData.deathday}
                      </p>
                    )}
                  </div>
                  <div>
                    {nid ? (
                      fid ? (
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          onClick={() => postfavorite("remove")}
                          className="md:ml-10 mt-5 md:mt-0 border-2 border-white self-end flex flex-row justify-between align-bottom p-2 rounded-lg text-xl cursor-pointer"
                        >
                          <p className="text-center">Remove from Favorites</p>
                          <img
                            src="/assets/broken-heart.png"
                            alt=""
                            className="w-6 h-6 mt-0.5 ml-4 self-center"
                          />
                        </motion.div>
                      ) : (
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          onClick={() => postfavorite("put")}
                          className="md:ml-10 mt-5 md:mt-0 border-2 border-white self-end flex flex-row justify-between align-bottom p-2 rounded-lg text-xl cursor-pointer"
                        >
                          <p className="text-center">Add to Favorites</p>
                          <img
                            src="/assets/lover.png"
                            alt=""
                            className="w-6 h-6 mt-0.5 ml-4 self-center"
                          />
                        </motion.div>
                      )
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-10 flex flex-col self-center">
            <h2 className="text-xl sm:text-2xl font-semibold mb-5">Images</h2>
            <div className="flex flex-row flex-wrap gap-3">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={`https://image.tmdb.org/t/p/w500${image.file_path}`}
                  alt="Actor Image"
                  className="w-24 h-24 sm:w-36 sm:h-36 object-cover"
                />
              ))}
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-xl sm:text-2xl font-semibold mb-5">Movies</h2>
            <div className="flex flex-wrap gap-3 sm:gap-5">
              {movies.map((movie, index) => (
                <Card key={index} data={movie} />
              ))}
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-xl sm:text-2xl font-semibold mb-5">TV Shows</h2>
            <div className="flex flex-wrap gap-3 sm:gap-5">
              {tvShows.map((tvShow, index) => (
                <Card key={index} data={tvShow} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActorPage;
