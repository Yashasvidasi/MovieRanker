"use client";
import React, { useContext } from "react";
import { SeachContext } from "./SearchContext";

interface PaginationProps {
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ onPageChange }) => {
  const { page, totalPages, searchcontent } = useContext(SeachContext)!;

  const handlePrevious = () => {
    if (page > 1) {
      onPageChange(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      onPageChange(page + 1);
    }
  };

  const handlePageClick = (page: number) => {
    onPageChange(page);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const startPage = Math.max(1, page - 1);
    const endPage = Math.min(totalPages, page + 1);

    if (startPage > 2) {
      pageNumbers.push(
        <button
          key={1}
          className={`mx-1 px-2 py-1 text-xs sm:text-sm md:text-base ${
            page === 1 ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
          }`}
          onClick={() => handlePageClick(1)}
        >
          1
        </button>
      );
      if (startPage > 3) {
        pageNumbers.push(
          <span
            key="start-dots"
            className="mx-1 text-xs sm:text-sm md:text-base"
          >
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`mx-1 px-2 py-1 text-xs sm:text-sm md:text-base ${
            page === i ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
          }`}
          onClick={() => handlePageClick(i)}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push(
          <span key="end-dots" className="mx-1 text-xs sm:text-sm md:text-base">
            ...
          </span>
        );
      }
      pageNumbers.push(
        <button
          key={totalPages}
          className={`mx-1 px-2 py-1 text-xs sm:text-sm md:text-base ${
            page === totalPages
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-black"
          }`}
          onClick={() => handlePageClick(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    return pageNumbers;
  };

  if (totalPages === 0) {
    return null;
  }

  if (
    searchcontent &&
    searchcontent.length === 1 &&
    searchcontent[0].title === "not_found"
  ) {
    return null;
  }
  return (
    <div className="flex flex-wrap justify-center mt-4 mb-4 space-x-2">
      <button
        onClick={handlePrevious}
        disabled={page === 1}
        className={`px-3 py-1 border border-gray-300 rounded bg-gray-200 text-black text-xs sm:text-sm md:text-base ${
          page === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"
        }`}
      >
        Previous
      </button>
      {renderPageNumbers()}
      <button
        onClick={handleNext}
        disabled={page === totalPages}
        className={`px-3 py-1 border border-gray-300 rounded bg-gray-200 text-black text-xs sm:text-sm md:text-base ${
          page === totalPages
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-gray-300"
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
