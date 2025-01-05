import { NextRequest, NextResponse } from "next/server";

const fetchimages = async (id: string) => {
  const url = `https://api.themoviedb.org/3/person/${id}/images`;

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.API_READ}`,
    },
  };

  const response = await fetch(url, options);
  const data = await response.json();
  if (response.status !== 200) {
    return null;
  } else {
    return data;
  }
};
const fetchmoviespopular = async (id: string) => {
  const url = `https://api.themoviedb.org/3/person/${id}?language=en-US`;

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.API_READ}`,
    },
  };

  const response = await fetch(url, options);
  const data = await response.json();
  if (response.status !== 200) {
    return null;
  } else {
    return data;
  }
};

const fetchtv = async (id: string) => {
  const url = `https://api.themoviedb.org/3/person/${id}/tv_credits?language=en-US`;

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.API_READ}`,
    },
  };

  const response = await fetch(url, options);
  const data = await response.json();
  if (response.status !== 200) {
    return null;
  } else {
    return data;
  }
};

const fetchmovies = async (id: string) => {
  const url = `https://api.themoviedb.org/3/person/${id}/movie_credits?language=en-US`;

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.API_READ}`,
    },
  };

  const response = await fetch(url, options);
  const data = await response.json();
  if (response.status !== 200) {
    return null;
  } else {
    return data;
  }
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { id } = body;
  try {
    const data = await fetchmoviespopular(id);
    const images = await fetchimages(id);
    const movies = await fetchmovies(id);
    const tvs = await fetchtv(id);
    if (data && images) {
      return NextResponse.json(
        {
          payload_data: data,
          payload_images: images.profiles,
          payload_movies: movies.cast,
          payload_tv: tvs.cast,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          error: "error fetching data",
        },
        { status: 500 }
      );
    }
  } catch (err) {
    return NextResponse.json(
      {
        error: err,
      },
      { status: 500 }
    );
  }
}
