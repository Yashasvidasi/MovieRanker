import mongoose, { Schema, Document } from "mongoose";

interface Movie {
  id: string;
  title: string;
  poster_path: string;
  otype: string;
}

interface MovieR {
  id: string;
  title: string;
  poster_path: string;
  rating: number;
  genres: string[];
}

interface SeriesR {
  id: string;
  name: string;
  poster_path: string;
  rating: number;
  genres: string[];
}

interface Actor {
  id: string;
  name: string;
  profile_path: string;
}

interface SeriesH {
  query: string;
  type: string;
  adult: boolean;
}

interface WatchH {
  id: string;
  title: string;
  poster_path: string;
  otype: string;
}

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  isVerified: boolean;
  isAdmin: boolean;
  forgotPasswordToken?: string;
  forgotPasswordTokenExpiry?: Date;
  verifyToken?: string;
  verifyTokenExpiry?: Date;

  WatchHistory: { list: WatchH[] };
  WatchLater: { list: Movie[] };
  MovieRanking: { list: MovieR[] };
  SeriesRanking: { list: SeriesR[] };
  FavoriteActors: { list: Actor[] };
  SearchHistory: { list: SeriesH[] };
}

const watchSchema: Schema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  poster_path: { type: String, required: true },
  otype: { type: String, required: true },
});

const movieSchema: Schema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  poster_path: { type: String, required: true },
  otype: { type: String, required: true },
});

const actorSchema: Schema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  profile_path: { type: String, required: true },
});

const movieRSchema: Schema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  poster_path: { type: String, required: true },
  rating: { type: Number, required: true },
  genres: { type: [String], required: true },
});

const seriesRSchema: Schema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  poster_path: { type: String, required: true },
  rating: { type: Number, required: true },
  genres: { type: [String], required: true },
});

const searchSchema: Schema = new Schema({
  query: { type: String, required: true },
  type: { type: String, required: true },
  adult: { type: Boolean, required: true },
});

const userSchema: Schema<IUser> = new Schema({
  username: {
    type: String,
    required: [true, "Please Provide a UserName"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please Provide an Email"],
    unique: true,
  },
  password: { type: String, required: [true, "Please Provide a Password"] },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
  verifyToken: String,
  verifyTokenExpiry: Date,

  WatchHistory: {
    list: [watchSchema],
  },

  WatchLater: {
    list: [movieSchema],
  },
  MovieRanking: {
    list: [movieRSchema],
  },
  SeriesRanking: {
    list: [seriesRSchema],
  },
  FavoriteActors: {
    list: [actorSchema],
  },
  SearchHistory: {
    list: [searchSchema],
  },
});

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
