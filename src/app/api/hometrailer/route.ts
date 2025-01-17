import { NextRequest, NextResponse } from "next/server";

const gettrailer = (data: any) => {
  const trailers = data.filter((items: { type: string }) => {
    return items.type === "Trailer";
  });
  return trailers[0];
};

const fetchmoviespopular = async (type: string, id: number) => {
  if (id === 0) {
    return null;
  }
  const url = `https://api.themoviedb.org/3/${type}/${id}/videos?language=en-US`;

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.API_READ}`,
    },
  };

  const response = await fetch(url, options);
  const data = await response.json();
  const yid = await gettrailer(data.results);
  if (response.status !== 200) {
    return null;
  } else {
    return yid.key;
  }
};

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();
    const { type, id } = body;

    const data = await fetchmoviespopular(type, id);

    return NextResponse.json(
      {
        payload: data,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        error: err,
      },
      { status: 406 }
    );
  }
}
