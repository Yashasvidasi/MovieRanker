// app/api/recommend/[type]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

// Define interfaces for the data structures
interface MovieData {
  id: number;
  title: string;
  poster_path: string;
}

interface TVData {
  id: number;
  name: string;
  poster_path: string;
}

// Helper function to read and parse CSV files
async function readCSV(filename: string): Promise<any[]> {
  const filePath = path.join(process.cwd(), "data", filename);
  const fileContent = await fs.readFile(filePath, "utf-8");
  return parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    cast: true,
  });
}

async function readMatrixCSV(filename: string): Promise<number[][]> {
  const filePath = path.join(process.cwd(), "data", filename);
  const fileContent = await fs.readFile(filePath, "utf-8");
  return parse(fileContent, {
    columns: false,
    skip_empty_lines: true,
    cast: true,
  });
}

// Function to get movie recommendations
async function getMovieRecommendations(movieId: string) {
  try {
    const movieData: MovieData[] = await readCSV("movieindex.csv");
    const matrixMovie = await readMatrixCSV("sorted_lists.csv");

    const movieIdNum = parseInt(movieId);
    if (!movieData.some((movie) => movie.id === movieIdNum)) {
      return [];
    }

    const index = movieData.findIndex((movie) => movie.id === movieIdNum);
    const recommendationIndices = matrixMovie[index];

    return recommendationIndices.map((idx) => ({
      id: String(movieData[idx].id),
      title: movieData[idx].title,
      poster_path: movieData[idx].poster_path,
    }));
  } catch (error) {
    console.error("Error getting movie recommendations:", error);
    return [];
  }
}

// Function to get TV recommendations
async function getTVRecommendations(tvId: string) {
  try {
    const tvData: TVData[] = await readCSV("tvindex.csv");
    const matrixTV = await readMatrixCSV("sorted_lists_tv.csv");

    const tvIdNum = parseInt(tvId);
    if (!tvData.some((show) => show.id === tvIdNum)) {
      return [];
    }

    const index = tvData.findIndex((show) => show.id === tvIdNum);
    const recommendationIndices = matrixTV[index];

    return recommendationIndices.map((idx) => ({
      id: String(tvData[idx].id),
      name: tvData[idx].name,
      poster_path: tvData[idx].poster_path,
    }));
  } catch (error) {
    console.error("Error getting TV recommendations:", error);
    return [];
  }
}

// POST handler for /api/recommend/movie
export async function POST(
  request: NextRequest,
  { params }: { params: { type: string } }
) {
  try {
    const body = await request.json();
    const id = body.id;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    let recommendations = [];
    if (params.type === "movie") {
      recommendations = await getMovieRecommendations(id);
    } else if (params.type === "tv") {
      recommendations = await getTVRecommendations(id);
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
