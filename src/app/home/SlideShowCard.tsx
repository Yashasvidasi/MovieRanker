import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const SlideShowCard = ({
  ref,
  data,
  controls,
  controlsbar,
}: {
  ref: any;
  data: any;
  controls: any;
  controlsbar: any;
}) => {
  const router = useRouter();

  // Generate the dynamic link
  const generateLink = () => {
    if (data.name) {
      return data.gender ? `/person/${data.id}` : `/tv/${data.id}`;
    }
    return `/movie/${data.id}`;
  };

  const link = generateLink();

  return (
    <motion.div
      ref={ref}
      className="w-full h-full flex flex-col relative overflow-hidden"
      animate={controls}
    >
      <motion.div
        className="absolute top-0 z-50 left-0 w-full h-1 bg-white"
        initial={{ width: "0%" }}
        animate={controlsbar}
      />

      <div className="relative w-full h-full">
        <img
          className="absolute right-0 top-0 md:w-[60%] h-full object-fill"
          src={`https://image.tmdb.org/t/p/w500/${data.backdrop_path}`}
          alt="Backdrop"
        />
        <div className="absolute top-0 right-0 w-[100%] md:w-[60%] h-full bg-black md:bg-gradient-to-l from-transparent to-black bg-opacity-70 md:bg-opacity-40"></div>
        <div className="relative flex flex-col w-full h-full p-10">
          <div className="flex flex-row justify-between h-full">
            <div className="flex flex-col w-full lg:w-1/2 h-full overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-transparent">
              <div className="lg:text-3xl text-lg text-white">
                {data.title || data.name}
              </div>
              <div className="lg:text-base text-sm text-white mt-2">
                {data.overview}
              </div>
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
                  <a href={link} rel="noopener noreferrer">
                    <motion.div
                      whileHover={{ scale: 1.04 }}
                      onClick={(e) => {
                        e.preventDefault(); // Prevent default anchor behavior
                        router.push(link); // Use SPA navigation
                      }}
                      className="p-2 hover:cursor-pointer border-2 border-white text-lg rounded-2xl flex flex-row"
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
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SlideShowCard;
