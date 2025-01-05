import { NextRequest, NextResponse } from "next/server";

const fetchmoviespopular = async (type: string, id: number) => {
  const url = `https://api.themoviedb.org/3/${type}/${id}?language=en-US`;
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

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json(); // Parse the request body
    const { type, id } = body;
    const data = await fetchmoviespopular(type, id);
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
