"use client";
import React, { useContext, useEffect, useState, forwardRef } from "react";
import { FilterContext } from "./FilterContext";
import FilterCard from "./FilterCard";
import PaginationFilter from "./Pagination2";

const FilterContainer = forwardRef<HTMLDivElement>((props, ref) => {
  const { filtercontent, page, setpage, totalpages } =
    useContext(FilterContext)!;

  const handlePageChange = (newPage: number) => {
    setpage(newPage);
  };

  useEffect(() => {
    console.log(filtercontent);
  }, [filtercontent]);

  return (
    <div
      ref={ref}
      className="w-full h-full overflow-auto flex flex-col p-5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white"
    >
      <div className="self-center ml-10 flex flex-row flex-wrap justify-start">
        {filtercontent &&
        filtercontent.length === 1 &&
        filtercontent[0].title === "not_found" ? (
          <div>No Results</div>
        ) : filtercontent && filtercontent.length !== 0 ? (
          filtercontent.map((item, index) => {
            return <FilterCard key={index} data={item} />;
          })
        ) : null}
      </div>
      <PaginationFilter onPageChange={handlePageChange} />
    </div>
  );
});

export default FilterContainer;

FilterContainer.displayName = "FilterContainer";
