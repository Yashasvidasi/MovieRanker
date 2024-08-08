import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbConfig";
import User from "@/models/userModels";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

connect();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // Parse the request body
    const { type, object, operation } = body;
    const token = req.cookies.get("token")?.value || "";
    console.log(token);

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

    if (user) {
      if (type === "searchpost") {
        console.log(object);
        if (object.query !== "") {
          const newarr = user.SearchHistory.list.filter((item: any) => {
            console.log(item);
            return (
              item.query === object.query &&
              item.type === object.type &&
              item.adult === object.adult
            );
          });

          if (newarr.length === 0) {
            user.SearchHistory.list.push(object);
          }
        }
      } else if (type === "searchpostdelete") {
        console.log(object);
        if (object.query !== "") {
          const newarr = user.SearchHistory.list.filter((item: any) => {
            return (
              item.query !== object.query &&
              item.type !== object.type &&
              item.adult !== object.adult
            );
          });

          user.SearchHistory.list = newarr;
        }
      } else if (operation === "put") {
        if (type === "watch_later") {
          const newarr = user.WatchLater.list.filter((item: any) => {
            return item.id === object.id;
          });

          if (newarr.length === 0) {
            user.WatchLater.list.push(object);
          }
          console.log(object, user.WatchLater.list);
        } else if (type === "watch_history") {
          const newarr = user.WatchHistory.list.filter((item: any) => {
            return item.id === object.id;
          });

          if (newarr.length === 0 && object.otype) {
            user.WatchHistory.list.push(object);
          }
          console.log(object, user.WatchHistory.list);
        } else if (type === "movie_ranking") {
          const newarr = user.MovieRanking.list.filter((item: any) => {
            return item.id === object.id;
          });

          if (newarr.length === 0) {
            user.MovieRanking.list.push(object);
          }
        } else if (type === "series_ranking") {
          const newarr = user.SeriesRanking.list.filter((item: any) => {
            return item.id === object.id;
          });

          if (newarr.length === 0) {
            user.SeriesRanking.list.push(object);
          }
        } else if (type === "favorite_actor") {
          const newarr = user.FavoriteActors.list.filter((item: any) => {
            return item.id === object.id;
          });

          if (newarr.length === 0) {
            user.FavoriteActors.list.push(object);
          }
        }
      } else if (operation === "remove") {
        if (type === "watch_later") {
          user.WatchLater.list = user.WatchLater.list.filter((item: any) => {
            return item.id !== object.id;
          });
        } else if (type === "watch_history") {
          user.MovieHistory.list = user.WatchHistory.list.filter(
            (item: any) => {
              return item.id !== object.id;
            }
          );
        } else if (type === "movie_ranking") {
          user.MovieRanking.list = user.MovieRanking.list.filter(
            (item: any) => {
              return item.id !== object.id;
            }
          );
        } else if (type === "series_ranking") {
          user.SeriesRanking.list = user.SeriesRanking.list.filter(
            (item: any) => {
              return item.id !== object.id;
            }
          );
        } else if (type === "favorite_actor") {
          user.FavoriteActors.list = user.FavoriteActors.list.filter(
            (item: any) => {
              return item.id !== object.id;
            }
          );
        }
      } else if (operation === "update") {
        if (type === "series_ranking") {
          let x = user.SeriesRanking.list.find((item: any) => {
            return item.id === object.id;
          });
          x.rating = object.rating;
        } else if (type === "movie_ranking") {
          let x = user.MovieRanking.list.find((item: any) => {
            return item.id === object.id;
          });
          x.rating = object.rating;
        }
      }

      const savedUser = await user.save();
      return NextResponse.json(
        { message: "Save Success", success: true },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "User Not Found", success: false },
        { status: 404 }
      );
    }
  } catch (err) {
    console.error("Error verifying user:", err);
    return NextResponse.json(
      { error: "Internal Error", success: false },
      { status: 500 }
    );
  }
}
