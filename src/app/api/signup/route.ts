import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { connect } from "@/dbconfig/dbConfig";
import User from "@/models/userModels";
import { sendEmail } from "@/helpers/mailer";
const crypto = require("crypto");
const EC = require("elliptic").ec,
  ec = new EC("secp256k1");

connect();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // Parse the request body
    const { username, email, password } = body;
    console.log(body);

    // Check if the username exists
    const userByUsername = await User.findOne({ username });
    if (userByUsername) {
      return NextResponse.json(
        { message: "Username already taken" },
        { status: 400 }
      );
    }

    // Check if the email exists
    const userByEmail = await User.findOne({ email });
    if (userByEmail) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 400 }
      );
    }

    // Continue with user registration if username and email are unique
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    // Send verification email
    await sendEmail({
      email,
      emailType: "VERIFY",
      userId: savedUser._id,
    });

    return NextResponse.json({
      message: "User registration successful",
      success: true,
      savedUser,
    });
  } catch (err) {
    console.error("Error verifying user:", err);
    return NextResponse.json(
      { error: "Failed to verify user" },
      { status: 500 }
    );
  }
}
