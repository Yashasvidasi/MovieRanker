import { NextRequest, NextResponse } from "next/server";

const getgenre = async (
  type: string,
  adult: string,
  lang: string,
  release: string,
  sort: string,
  genre: string,
  order: string,
  page: string
) => {
  let releaseS;
  if (type === "series") {
    type = "tv";
    releaseS = `&first_air_date_year=${release}`;
  } else {
    releaseS = `&primary_release_year=${release}`;
  }

  if (release === "any") {
    releaseS = "";
  }

  const adultS = adult ? "true" : "false";

  let genreS;
  if (genre === "any") {
    genreS = "";
  } else {
    genreS = `&with_genres=${genre}`;
  }

  let langS;
  if (lang === "any") {
    langS = "";
  } else {
    langS = `&with_original_language=${lang}`;
  }

  const url = `https://api.themoviedb.org/3/discover/${type}?include_adult=${adultS}${langS}&page=${page}${releaseS}${genreS}&sort_by=${sort}.${order}`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.API_READ}`,
    },
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      console.error("Error fetching data:", data);
      return null;
    }
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // Parse the request body
    const { adult, genre, lang, order, release, sort, type, page } = body;

    const data = await getgenre(
      type,
      adult,
      lang,
      release,
      sort,
      genre,
      order,
      page
    );
    if (data) {
      return NextResponse.json(
        {
          payload: data,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          error: "Error fetching data",
        },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("Error processing request:", err);
    return NextResponse.json(
      {
        error: "Error processing request",
      },
      { status: 500 }
    );
  }
}
