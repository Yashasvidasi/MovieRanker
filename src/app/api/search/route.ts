import { NextRequest, NextResponse } from "next/server";

const fetchmovies = async (
  queryString: string,
  adultString: string,
  type: string,
  page: number
) => {
  const url = `https://api.themoviedb.org/3/search/${type}?query=${queryString}&include_adult=${adultString}&language=en-US&page=${page}`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.API_READ}`,
    },
  };

  const response = await fetch(url, options);
  const data = await response.json();
  return data;
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { sterm, type, adult, page } = body;
  const queryString = sterm.split(" ").join("%20");
  const adultString = adult ? "true" : "false";
  const typeString = type === "series" ? "tv" : type;

  try {
    const data = await fetchmovies(queryString, adultString, typeString, page);
    const response = NextResponse.json(
      {
        payload: data,
      },
      { status: 200 }
    );
    return response;
  } catch (err) {
    const response = NextResponse.json(
      {
        error: err,
      },
      { status: 300 }
    );
    return response;
  }
}
