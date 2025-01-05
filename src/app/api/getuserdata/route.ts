import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { connect } from "@/dbconfig/dbConfig";
import User from "@/models/userModels";
import { sendEmail } from "@/helpers/mailer";
import jwt from "jsonwebtoken";

connect();

export async function GET(req: NextRequest) {
  try {
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
        },
        { status: 404 }
      );
      return response;
    } else {
      const response = NextResponse.json(
        {
          message: "User found",
          success: true,
          name: user.username,
          watch_history: user.WatchHistory.list,
          movie_ranking: user.MovieRanking.list,
          series_ranking: user.SeriesRanking.list,
          watch_later: user.WatchLater.list,
          favorite_actors: user.FavoriteActors.list,
        },
        { status: 404 }
      );
      return response;
    }
  } catch (err) {
    const response = NextResponse.json(
      {
        message: "User not logged in",
        success: false,
        id: "user_not_logged_in",
      },
      { status: 404 }
    );
    return response;
  }
}
