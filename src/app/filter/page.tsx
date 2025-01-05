"use client";

import { useContext, useEffect, useRef, useState } from "react";
import FilterBar from "./FilterBar";
import { FilterProvider, FilterContext } from "./FilterContext";
import SideBar from "@/components/SideBar";
import React from "react";
import FilterContainer from "./FilterContainer";

const Filter = () => {
  const {
    type,
    release,
    sort,
    order,
    genre,
    lang,
    page,
    setpage,
    totalpages,
    settotalpages,
    filtercontent,
    setfiltercontent,
    // Add any other context methods or state you need here
  } = useContext(FilterContext)!;

  const refer = useRef<HTMLDivElement>(null);
  const [initialLoad, setInitialLoad] = useState(false);

  const notfound = [
    {
      title: "not_found",
      poster_path: "not_found",
    },
  ];

  const fetchFilteredMovies = async (page: number) => {
    const response = await fetch(`/api/filtersearch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type,
        release,
        sort,
        order,
        genre,
        lang,
        page,
        adult: false, // Example value; adjust as needed
      }),
    });

    if (response.status !== 200) {
      return null;
    } else {
      const data = await response.json();
      return data.payload;
    }
  };

  const handleSearch = async () => {
    setpage(1);
    const content = await fetchFilteredMovies(1);

    if (content.total_results === 0) {
      setfiltercontent(notfound);
      return;
    }
    if (content === null) {
      return;
    }
    settotalpages(content.total_pages);
    setfiltercontent(content.results);
    setInitialLoad(true); // Mark initial load as completed
  };

  const handlepagechange = async () => {
    const content = await fetchFilteredMovies(page);

    if (content === null) {
      return;
    }
    setfiltercontent(content.results);
  };

  useEffect(() => {
    if (initialLoad) {
      handlepagechange();
      if (refer.current) {
        refer.current.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, [page, initialLoad]);

  return (
    <div className="relative flex flex-row w-screen h-screen bg-black overflow-hidden text-white">
      <SideBar />
      <div className="w-full flex flex-col">
        <FilterBar handlefilter={handleSearch} />
        <FilterContainer ref={refer} />
      </div>
    </div>
  );
};

const WrappedPage = () => (
  <FilterProvider>
    <Filter />
  </FilterProvider>
);

export default WrappedPage;
