import { NextRequest, NextResponse } from "next/server";

const fetchimages = async (id: string) => {
  const url = `https://api.themoviedb.org/3/tv/${id}/images?include_image_language=null`;

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

const fetchrecc = async (id: string) => {
  const url = `https://api.themoviedb.org/3/tv/${id}/similar?language=en-US&page=1`;

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

const fetchreviews = async (id: string) => {
  const url = `https://api.themoviedb.org/3/tv/${id}/reviews?language=en-US&page=1`;

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
  const url = `https://api.themoviedb.org/3/tv/${id}?language=en-US`;

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

const fetchcast = async (id: string) => {
  const url = `https://api.themoviedb.org/3/tv/${id}/credits?language=en-US`;

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
    const recc = await fetchrecc(id);
    const revs = await fetchreviews(id);
    const cast = await fetchcast(id);
    if (data && images && recc && revs) {
      return NextResponse.json(
        {
          payload_data: data,
          payload_images: images.backdrops,
          payload_recc: recc.results,
          payload_revs: revs.results,
          payload_cast: cast.cast.slice(0, 12),
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
