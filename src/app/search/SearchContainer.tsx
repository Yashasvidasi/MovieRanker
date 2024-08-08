"use client";
import React, { useContext, useEffect, useState, forwardRef } from "react";
import { SeachContext } from "./SearchContext";
import SearchCard from "./SearchCard";
import Pagination from "./Pagination";
import { motion } from "framer-motion";

interface SearchContainerProps {
  handleSearch: () => Promise<void>;
}

const SearchContainer = forwardRef<HTMLDivElement, SearchContainerProps>(
  ({ handleSearch }, ref) => {
    const [searches, setsearches] = useState([]);
    const {
      settype,
      setadult,
      setquery,
      searchcontent,
      page,
      setpage,
      totalPages,
    } = useContext(SeachContext)!;

    const [isQuerySet, setIsQuerySet] = useState(false);
    const [isAdultSet, setIsAdultSet] = useState(false);
    const [isTypeSet, setIsTypeSet] = useState(false);

    const [loading, setloading] = useState(false);
    useEffect(() => {
      const getdata = async () => {
        try {
          const response = await fetch(`/api/getdata`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: null, from: "search" }),
          });

          const result = await response.json();

          if (result.success) {
            setsearches(result.searches);
          }
        } catch (err) {
          console.log(err);
        }
      };

      getdata();
    }, []);

    const handlePageChange = (newPage: number) => {
      setpage(newPage);
    };

    const cap = (string: string) => {
      return string.charAt(0).toUpperCase() + string.slice(1);
    };

    useEffect(() => {
      if (isQuerySet && isAdultSet && isTypeSet) {
        handleSearch();
        setIsQuerySet(false);
        setIsAdultSet(false);
        setIsTypeSet(false);
      }
    }, [isQuerySet, isAdultSet, isTypeSet]);

    const handleClick = (item: any) => {
      setquery(item.query);
      setadult(item.adult);
      settype(item.type);
      setIsQuerySet(true);
      setIsAdultSet(true);
      setIsTypeSet(true);
    };

    const postsearchdelete = async (item: any) => {
      setloading(true);
      const response = await fetch(`/api/updatedetails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          object: item,
          type: "searchpostdelete",
        }),
      });

      const data = await response.json();

      if (data.success) {
        setsearches(
          searches.filter((element: any) => {
            return (
              element.query !== item.query &&
              element.type !== item.type &&
              element.adult !== item.adult
            );
          })
        );

        setloading(false);
      }
    };

    return (
      <div
        ref={ref}
        className="w-full h-full overflow-auto flex flex-col p-5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white"
      >
        <div className="self-center pl-10 flex flex-row flex-wrap justify-start w-full  ">
          {searchcontent &&
          searchcontent.length === 1 &&
          searchcontent[0].title === "not_found" ? (
            <div>No Results</div>
          ) : searchcontent && searchcontent.length !== 0 ? (
            searchcontent.map((item, index) => {
              return <SearchCard key={index} data={item} />;
            })
          ) : (
            <div className="flex flex-col justify-start w-full h-full">
              {searches
                ? searches.map((item: any, index) => {
                    return (
                      <div
                        key={index}
                        className="w-full hover:cursor-pointer flex flex-row justify-between text-2xl m-2 -ml-2 border-b pb-2 border-white"
                      >
                        <motion.div
                          onClick={() => {
                            handleClick(item);
                          }}
                          whileHover={{
                            scale: 1.03,
                          }}
                          className="pl-20 flex flex-row flex-grow  "
                        >
                          <p className="m-1">{cap(item.query)}</p>
                          <p className="m-1">
                            - {item.adult ? "18+" : "Normal"}
                          </p>
                          <p className="m-1">- {cap(item.type)}</p>
                        </motion.div>
                        <motion.div
                          className={`self-center mr-10 hover:${
                            loading ? "cursor-wait" : "cursor-pointer"
                          }`}
                          onClick={() => {
                            postsearchdelete(item);
                          }}
                          whileHover={{
                            scale: 1.09,
                          }}
                        >
                          <img
                            src="/assets/minus-button.png"
                            alt=""
                            className="w-8 h-8 self-center mt-0.5 ml-4"
                            style={{
                              filter: "invert(100%)",
                            }}
                          />
                        </motion.div>
                      </div>
                    );
                  })
                : null}
            </div>
          )}
        </div>
        <Pagination onPageChange={handlePageChange} />
      </div>
    );
  }
);

export default SearchContainer;

SearchContainer.displayName = "SearchContainer";
