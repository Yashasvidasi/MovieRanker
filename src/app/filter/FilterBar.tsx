"use client";
import React, { useContext, useEffect, useState } from "react";
import { FilterContext } from "./FilterContext";
import { FaChevronDown } from "react-icons/fa";

const FilterBar = ({ handlefilter }: { handlefilter: () => void }) => {
  const [dropdownOpen, setDropdownOpen] = useState<string>("");
  const [years] = useState(
    Array.from({ length: 75 }, (_, i) => (2024 - i).toString())
  );
  const [languages, setLanguages] = useState<
    { iso_639_1: string; english_name: string }[]
  >([]);
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [adult, setAdult] = useState<boolean>(false);

  const [showorder, setshoworder] = useState("Descending");
  const [showsort, setshowsort] = useState("Popularity");
  const [showlang, setshowlang] = useState("Any");
  const [showgenre, setshowgenre] = useState("Any");

  const {
    type,
    settype,
    release,
    setrelease,
    sort,
    setsort,
    order,
    setorder,
    genre,
    setgenre,
    lang,
    setlang,
  } = useContext(FilterContext)!;

  const fetchGenres = async () => {
    const response = await fetch(`/api/genres`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type }),
    });

    if (response.status === 200) {
      const data = await response.json();
      setGenres(data.payload.genres);
    }
  };

  const fetchLanguages = async () => {
    const response = await fetch(`/api/lang`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      const data = await response.json();
      const sortedLanguages = data.payload.sort(
        (a: { english_name: number }, b: { english_name: number }) => {
          if (a.english_name < b.english_name) return -1;
          if (a.english_name > b.english_name) return 1;
          return 0;
        }
      );
      setLanguages(sortedLanguages);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, [type]);

  useEffect(() => {
    fetchLanguages();
  }, []);

  const handleSelect = (field: string, value: string) => {
    switch (field) {
      case "type":
        settype(value);
        break;
      case "release":
        setrelease(value);
        break;
      case "sort":
        setsort(value);
        break;
      case "order":
        setorder(value);
        break;
      case "genre":
        setgenre(value);
        break;
      case "lang":
        setlang(value);
        break;
    }
    setDropdownOpen("");
  };

  return (
    <div className="flex flex-wrap gap-4 justify-center px-3 mt-8 pb-10 rounded-2xl border-white">
      {/* Type Dropdown */}
      <div className="relative flex-shrink-0 w-fit md:w-auto">
        <label className="block mb-1 text-slate-100">Type</label>
        <button
          onClick={() => setDropdownOpen(dropdownOpen === "type" ? "" : "type")}
          className="p-2 border border-gray-300 rounded flex items-center justify-between w-fit md:w-40"
        >
          {type.charAt(0).toUpperCase() + type.slice(1) || "Type"}
          <FaChevronDown
            className={`ml-2 transition-transform ${
              dropdownOpen === "type" ? "rotate-180" : ""
            }`}
          />
        </button>
        {dropdownOpen === "type" && (
          <ul className="absolute text-black mt-1 w-fit border border-gray-300 rounded bg-white shadow-lg z-10">
            <li
              onClick={() => handleSelect("type", "movie")}
              className="p-2 cursor-pointer hover:bg-gray-300"
            >
              Movie
            </li>
            <li
              onClick={() => handleSelect("type", "series")}
              className="p-2 cursor-pointer hover:bg-gray-300"
            >
              Series
            </li>
          </ul>
        )}
      </div>
      {/* Release Year Dropdown */}
      <div className="relative flex-shrink-0 w-fit sm:w-auto">
        <label className="block mb-1 text-slate-100">Year</label>
        <button
          onClick={() =>
            setDropdownOpen(dropdownOpen === "release" ? "" : "release")
          }
          className="p-2 border border-gray-300 rounded flex items-center justify-between w-fit sm:w-36 md:w-40"
        >
          {release || "Year"}
          <FaChevronDown
            className={`ml-2 transition-transform ${
              dropdownOpen === "release" ? "rotate-180" : ""
            }`}
          />
        </button>
        {dropdownOpen === "release" && (
          <ul className="absolute text-black mt-1 w-fit border border-gray-300 rounded bg-white shadow-lg z-10 max-h-60 overflow-auto">
            <li
              key={"any"}
              onClick={() => handleSelect("release", "any")}
              className="p-2 cursor-pointer hover:bg-gray-300"
            >
              Any
            </li>
            {years.map((year) => (
              <li
                key={year}
                onClick={() => handleSelect("release", year)}
                className="p-2 cursor-pointer hover:bg-gray-300"
              >
                {year}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Sort By Dropdown */}
      <div className="relative flex-shrink-0 w-fit sm:w-auto">
        <label className="block mb-1 text-slate-100">Sort By</label>
        <button
          onClick={() => setDropdownOpen(dropdownOpen === "sort" ? "" : "sort")}
          className="p-2 border border-gray-300 rounded flex items-center justify-between w-fit sm:w-36 md:w-40"
        >
          {showsort || "Sort By"}
          <FaChevronDown
            className={`ml-2 transition-transform ${
              dropdownOpen === "sort" ? "rotate-180" : ""
            }`}
          />
        </button>
        {dropdownOpen === "sort" && (
          <ul className="absolute text-black mt-1 w-fit border border-gray-300 rounded bg-white shadow-lg z-10">
            <li
              onClick={() => {
                handleSelect("sort", "popularity");
                setshowsort("Popularity");
              }}
              className="p-2 cursor-pointer hover:bg-gray-300"
            >
              Popularity
            </li>
            <li
              onClick={() => {
                handleSelect("sort", "title");
                setshowsort("Title");
              }}
              className="p-2 cursor-pointer hover:bg-gray-300"
            >
              Title
            </li>
            <li
              onClick={() => {
                handleSelect("sort", "revenue");
                setshowsort("Revenue");
              }}
              className="p-2 cursor-pointer hover:bg-gray-300"
            >
              Revenue
            </li>
            <li
              onClick={() => {
                handleSelect("sort", "primary_release_date");
                setshowsort("Primary Release Date");
              }}
              className="p-2 cursor-pointer hover:bg-gray-300"
            >
              Primary Release Date
            </li>
            <li
              onClick={() => {
                handleSelect("sort", "vote_average");
                setshowsort("Vote Average");
              }}
              className="p-2 cursor-pointer hover:bg-gray-300"
            >
              Vote Average
            </li>
          </ul>
        )}
      </div>

      {/* Order Dropdown */}
      <div className="relative flex-shrink-0 w-fit sm:w-auto">
        <label className="block mb-1 text-slate-100">Order</label>
        <button
          onClick={() =>
            setDropdownOpen(dropdownOpen === "order" ? "" : "order")
          }
          className="p-2 border border-gray-300 rounded flex items-center justify-between w-fit sm:w-36 md:w-40"
        >
          {showorder || "Order"}
          <FaChevronDown
            className={`ml-2 transition-transform ${
              dropdownOpen === "order" ? "rotate-180" : ""
            }`}
          />
        </button>
        {dropdownOpen === "order" && (
          <ul className="absolute text-black mt-1 w-fit border border-gray-300 rounded bg-white shadow-lg z-10">
            <li
              onClick={() => {
                handleSelect("order", "asc");
                setshoworder("Ascending");
              }}
              className="p-2 cursor-pointer hover:bg-gray-300"
            >
              Ascending
            </li>
            <li
              onClick={() => {
                handleSelect("order", "desc");
                setshoworder("Descending");
              }}
              className="p-2 cursor-pointer hover:bg-gray-300"
            >
              Descending
            </li>
          </ul>
        )}
      </div>

      {/* Genre Dropdown */}
      <div className="relative flex-shrink-0 w-fit sm:w-auto">
        <label className="block mb-1 text-slate-100">Genre</label>
        <button
          onClick={() =>
            setDropdownOpen(dropdownOpen === "genre" ? "" : "genre")
          }
          className="p-2 border border-gray-300 rounded flex items-center justify-between w-fit sm:w-36 md:w-40"
        >
          {showgenre || "Genre"}
          <FaChevronDown
            className={`ml-2 transition-transform ${
              dropdownOpen === "genre" ? "rotate-180" : ""
            }`}
          />
        </button>
        {dropdownOpen === "genre" && (
          <ul className="absolute text-black mt-1 w-fit border border-gray-300 rounded bg-white shadow-lg z-10 max-h-48 overflow-auto">
            <li
              key={"any"}
              onClick={() => {
                handleSelect("genre", "any");
                setshowgenre("Any");
              }}
              className="p-2 cursor-pointer hover:bg-gray-300"
            >
              Any
            </li>
            {genres.map((gen) => (
              <li
                key={gen.id}
                onClick={() => {
                  handleSelect("genre", `${gen.id}`);
                  setshowgenre(gen.name);
                }}
                className="p-2 cursor-pointer hover:bg-gray-300"
              >
                {gen.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Language Dropdown */}
      <div className="relative flex-shrink-0 w-fit sm:w-auto">
        <label className="block mb-1 text-slate-100">Language</label>
        <button
          onClick={() => setDropdownOpen(dropdownOpen === "lang" ? "" : "lang")}
          className="p-2 border border-gray-300 rounded flex items-center justify-between w-fit sm:w-36 md:w-40"
        >
          {showlang || "Language"}
          <FaChevronDown
            className={`ml-2 transition-transform ${
              dropdownOpen === "lang" ? "rotate-180" : ""
            }`}
          />
        </button>
        {dropdownOpen === "lang" && (
          <ul className="absolute text-black mt-1 w-fit border border-gray-300 rounded bg-white shadow-lg z-10 max-h-48 overflow-auto">
            <li
              key={"any"}
              onClick={() => {
                handleSelect("lang", `any`);
                setshowgenre("Any");
              }}
              className="p-2 cursor-pointer hover:bg-gray-300"
            >
              Any
            </li>
            {languages.map((language) => (
              <li
                key={language.iso_639_1}
                onClick={() => {
                  handleSelect("lang", language.iso_639_1);
                  setshowlang(language.english_name);
                }}
                className="p-2 cursor-pointer hover:bg-gray-300"
              >
                {language.english_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Adult Switch */}
      <div className="flex items-center space-x-2 w-fit sm:w-auto">
        <label className="flex items-center space-x-2">
          <div className="relative inline-block w-12 align-middle select-none transition duration-200 ease-in">
            <input
              type="checkbox"
              checked={adult}
              onChange={(e) => setAdult(e.target.checked)}
              className={`absolute block w-6 h-6 rounded-full border-4 appearance-none cursor-pointer transition-all duration-200 ease-in-out transform ${
                adult
                  ? "translate-x-4 bg-purple-500 border-purple-500 shadow-lg"
                  : "translate-x-0 bg-gray-400 border-gray-400 shadow-md"
              }`}
              style={{ top: "0.15rem", left: "0.25rem" }}
            />
            <span
              className={`block overflow-hidden h-7 rounded-full bg-gray-300 cursor-pointer transition-all duration-200 ease-in-out ${
                adult ? "bg-purple-300" : "bg-gray-300"
              }`}
            ></span>
          </div>
          <span
            className={`text-lg ${
              adult ? "text-purple-400" : "text-slate-100"
            }`}
          >
            Include 18+
          </span>
        </label>
      </div>

      {/* Search Button */}
      <div className="w-fit sm:w-auto mt-4">
        <button
          onClick={handlefilter}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-fit sm:w-auto"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
