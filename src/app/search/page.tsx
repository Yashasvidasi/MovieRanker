"use client";

import { useContext, useEffect, useRef, useState } from "react";
import SideBar from "@/components/SideBar";
import React from "react";
import SearchBar from "./SearchBar";
import { SearchProvider } from "./SearchContext";
import { SeachContext } from "./SearchContext";
import SearchContainer from "./SearchContainer";

const Page = () => {
  const {
    query,
    page,
    adult,
    type,
    searchcontent,
    setsearchcontent,
    setpage,
    totalPages,
    settotalPages,
  } = useContext(SeachContext)!;

  const refer = useRef<HTMLDivElement>(null);

  const notfound = [
    {
      title: "not_found",
      poster_path: "not_found",
    },
  ];

  const postsearch = async () => {
    const response = await fetch(`/api/updatedetails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        object: {
          query: query,
          type: type,
          adult: adult,
        },
        type: "searchpost",
      }),
    });
  };
  const fetchmovies = async (page: number) => {
    const response = await fetch(`/api/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sterm: query,
        page: page,
        adult: adult,
        type: type,
      }),
    });

    if (page === 1) {
      postsearch();
    }

    if (response.status !== 200) {
      return null;
    } else {
      const data = await response.json();
      return data.payload;
    }
  };

  const handleSearch = async () => {
    setpage(1);
    const content = await fetchmovies(1);
    console.log(content);

    if (content.total_results === 0) {
      setsearchcontent(notfound);
      return;
    }
    if (content === null) {
      return;
    }
    settotalPages(content.total_pages);
    setsearchcontent(content.results);
  };

  const handlepagechange = async () => {
    const content = await fetchmovies(page);
    console.log(content);
    if (content === null) {
      return;
    }
    setsearchcontent(content.results);
  };

  useEffect(() => {
    handlepagechange();
    if (refer.current) {
      refer.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [page]);

  return (
    <div className="relative flex flex-row w-screen h-screen bg-black overflow-hidden text-white">
      <SideBar />
      <div className="w-full flex flex-col">
        <SearchBar handleSearch={handleSearch} />
        <SearchContainer handleSearch={handleSearch} ref={refer} />
      </div>
    </div>
  );
};

const WrappedPage = () => (
  <SearchProvider>
    <Page />
  </SearchProvider>
);

export default WrappedPage;
