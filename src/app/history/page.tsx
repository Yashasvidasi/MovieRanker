"use client";
import React, { useEffect, useState } from "react";
import Card from "./Card"; // Import the Card component
import SideBar from "@/components/SideBar";

const Page = () => {
  const [watchHistory, setWatchHistory] = useState<any[]>([]);
  const [msg, setmsg] = useState("loading...");

  useEffect(() => {
    // Retrieve the WatchHistory from localStorage
    const storedHistory = localStorage.getItem("WatchHistory");

    // Parse the history and update the state
    if (storedHistory) {
      setWatchHistory(JSON.parse(storedHistory));
      if (JSON.parse(storedHistory).length === 0) {
        setmsg("Nothing here");
      }
    }
  }, []);

  return (
    <div className="relative flex flex-row w-screen h-screen bg-black overflow-hidden text-white">
      <SideBar />
      <div className="flex flex-col ml-10">
        <div className="mt-5 text-5xl mb-5 font-semibold ">
          Continue Watching
        </div>
        <div className="flex flex-row flex-wrap justify-start w-full">
          {watchHistory.length > 0 ? (
            watchHistory.map((item, index) => (
              <div key={index} className="m-4">
                <Card data={item} />
              </div>
            ))
          ) : (
            <p className="text-center text-lg">{msg}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
