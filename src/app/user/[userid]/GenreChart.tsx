"use client";

import React, { useMemo } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  Title,
} from "chart.js";
import { color } from "chart.js/helpers";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  Title
);

interface GenreChartProps {
  movieRanking: {
    id: number;
    title: string;
    genres: string[];
    rating: number;
  }[];
  seriesRanking: {
    id: number;
    title: string;
    genres: string[];
    rating: number;
  }[];
}

const GenreChart: React.FC<GenreChartProps> = ({
  movieRanking,
  seriesRanking,
}) => {
  const calculateGenreData = useMemo(() => {
    const genreCountmovies: { [key: string]: number } = {};
    const likedGenreCountmovies: { [key: string]: number } = {};
    const hatedGenreCountmovies: { [key: string]: number } = {};

    const genreCountseries: { [key: string]: number } = {};
    const likedGenreCountseries: { [key: string]: number } = {};
    const hatedGenreCountseries: { [key: string]: number } = {};

    const processRankingmovies = (
      ranking: { genres: string[]; rating: number }[]
    ) => {
      ranking.forEach((item) => {
        item.genres.forEach((genre) => {
          genreCountmovies[genre] = (genreCountmovies[genre] || 0) + 1;
          if (item.rating >= 8) {
            likedGenreCountmovies[genre] =
              (likedGenreCountmovies[genre] || 0) + 1;
          } else if (item.rating <= 4) {
            hatedGenreCountmovies[genre] =
              (hatedGenreCountmovies[genre] || 0) + 1;
          }
        });
      });
    };

    const processRankingseries = (
      ranking: { genres: string[]; rating: number }[]
    ) => {
      ranking.forEach((item) => {
        item.genres.forEach((genre) => {
          genreCountseries[genre] = (genreCountseries[genre] || 0) + 1;
          if (item.rating >= 8) {
            likedGenreCountseries[genre] =
              (likedGenreCountseries[genre] || 0) + 1;
          } else if (item.rating <= 4) {
            hatedGenreCountseries[genre] =
              (hatedGenreCountseries[genre] || 0) + 1;
          }
        });
      });
    };

    processRankingmovies(movieRanking);
    processRankingseries(seriesRanking);

    return {
      genreCountmovies,
      likedGenreCountmovies,
      hatedGenreCountmovies,
      genreCountseries,
      likedGenreCountseries,
      hatedGenreCountseries,
    };
  }, [movieRanking, seriesRanking]);

  const {
    genreCountmovies,
    likedGenreCountmovies,
    hatedGenreCountmovies,
    genreCountseries,
    likedGenreCountseries,
    hatedGenreCountseries,
  } = calculateGenreData;

  const createChartData = (dataObject: { [key: string]: number }) => ({
    labels: Object.keys(dataObject),
    datasets: [
      {
        data: Object.values(dataObject),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
        ],
        borderColor: "#fff",
        borderWidth: 1,
      },
    ],
  });

  const options = (title: string) => ({
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          font: {
            size: 16, // Adjust the size as needed
          },
          padding: 10, // Adjust padding between legend items
        },
        align: "start" as const, // Ensure you use 'start', 'center', or 'end'
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 20, // Adjust the size as needed
        },
        padding: {
          bottom: 20, // Adjust padding below the title
        },
      },
    },
  });

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex flex-col w-full">
        <div className="text-3xl text-center mt-3 mb-5">Movies</div>
        <div className="flex flex-row justify-evenly gap-12 w-full  flex-wrap">
          <div className="w-80 text-lg  flex flex-row justify-center ">
            <Pie
              data={createChartData(genreCountmovies)}
              options={options("Watched Genres")}
            />
          </div>

          <div className="w-80 flex flex-row justify-center">
            <Pie
              data={createChartData(likedGenreCountmovies)}
              options={options("Liked Genres")}
            />
          </div>
          <div className="w-80 flex flex-row justify-center">
            <Pie
              data={createChartData(hatedGenreCountmovies)}
              options={options("Hated Genres")}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col mt-10 w-full ">
        <div className="text-3xl text-center mt-3 mb-5">Series</div>
        <div className="flex flex-row justify-evenly gap-12 w-full  flex-wrap">
          <div className="w-80 flex flex-row justify-center">
            <Pie
              data={createChartData(genreCountseries)}
              options={options("Watched Genres")}
            />
          </div>
          <div className="w-80 flex flex-row justify-center">
            <Pie
              data={createChartData(likedGenreCountseries)}
              options={options("Liked Genres")}
            />
          </div>
          <div className="w-80 flex flex-row justify-center">
            <Pie
              data={createChartData(hatedGenreCountseries)}
              options={options("Hated Genres")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenreChart;
