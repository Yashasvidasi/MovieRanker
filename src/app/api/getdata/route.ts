import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { connect } from "@/dbconfig/dbConfig";
import User from "@/models/userModels";
import { sendEmail } from "@/helpers/mailer";
import jwt from "jsonwebtoken";

connect();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, from } = body;
    const token = req.cookies.get("token")?.value || "";

    if (token === "") {
      const response = NextResponse.json(
        {
          message: "Not logged in",
          success: false,
          id: "not_logged_in",
          tracker: "ok",
        },
        { status: 301 }
      );
      return response;
    }

    const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);
    const user = await User.findOne({ _id: decodedToken.id });

    if (!user) {
      const response = NextResponse.json(
        {
          message: "User not found",
          success: false,
          id: "user_not_found",
          tracker: "ok",
        },
        { status: 404 }
      );
      return response;
    }

    let listWatchLater = user.WatchLater.list;

    switch (from) {
      case "movie":
        let listRankingMovies = user.MovieRanking.list;

        const isPresentWL = listWatchLater.find((item: { id: any }) => {
          return item.id === id;
        });

        const isPresentRM = listRankingMovies.find((item: { id: any }) => {
          return item.id === id;
        });

        const response = NextResponse.json(
          {
            success: true,
            watch_later: isPresentWL !== undefined ? true : false,
            ranking_movies: isPresentRM,
          },
          { status: 200 }
        );
        return response;

      case "series":
        let listRankingSeries = user.SeriesRanking.list;

        const isPresentWLs = listWatchLater.find((item: { id: any }) => {
          return item.id === id;
        });

        const isPresentRMs = listRankingSeries.find((item: { id: any }) => {
          return item.id === id;
        });

        const responsee = NextResponse.json(
          {
            success: true,
            watch_later: isPresentWLs !== undefined ? true : false,
            ranking_series: isPresentRMs,
          },
          { status: 200 }
        );

        return responsee;
      case "person":
        let favorites = user.FavoriteActors.list;

        const ispresent = favorites.find((item: { id: any }) => {
          return item.id === id;
        });

        const responsep = NextResponse.json(
          {
            success: true,
            favorite_actor: ispresent !== undefined ? true : false,
          },
          { status: 200 }
        );

        return responsep;
      case "search":
        let searches = user.SearchHistory.list;

        const responsesearch = NextResponse.json(
          {
            success: true,
            searches: searches,
          },
          { status: 200 }
        );

        return responsesearch;
    }
  } catch (err) {
    console.error(err);
    const response = NextResponse.json(
      {
        message: "An error occurred",
        success: false,
        id: "error_occurred",
        isPresent: false,
      },
      { status: 500 }
    );
    return response;
  }
}
