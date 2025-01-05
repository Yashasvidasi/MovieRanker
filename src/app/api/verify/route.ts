import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { connect } from "@/dbconfig/dbConfig";
import User from "@/models/userModels";
import { sendEmail } from "@/helpers/mailer";

connect();

export async function POST(req: NextRequest) {
  try {
    const reqbody = await req.json();
    const { token } = reqbody;

    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid Token" }, { status: 400 });
    }

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;
    user.WatchHistory.list = [];
    user.WatchLater.list = [];
    user.MovieRanking.list = [];
    user.FavoriteActors.list = [];
    user.SearchHistory.list = [];
    user.SeriesRanking.list = [];

    await user.save();

    return NextResponse.json(
      {
        message: "Email Verified",
        success: true,
        tracker: "ok",
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
