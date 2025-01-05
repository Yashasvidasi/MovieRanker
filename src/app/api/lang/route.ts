import { NextRequest, NextResponse } from "next/server";

const getlang = async () => {
  const url = "https://api.themoviedb.org/3/configuration/languages";
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

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const data = await getlang();
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
