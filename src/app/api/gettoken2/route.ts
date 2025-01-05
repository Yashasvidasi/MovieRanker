import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value || "";

    if (token === "") {
      const response = NextResponse.json(
        {
          message: "Not logged in",
          success: true,
          id: "not_logged_in",
          tracker: "ok",
        },
        { status: 301 }
      );

      return response;
    }
    const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);
    const response = NextResponse.json(
      {
        message: "Login true",
        success: true,
        id: decodedToken.id,
        tracker: "ok",
      },
      { status: 200 }
    );

    return response;
  } catch (err) {
    const response = NextResponse.json(
      {
        message: "Not logged in",
        success: true,
        id: "not_logged_in",
        tracker: "ok",
      },
      { status: 300 }
    );

    return response;
  }
}
