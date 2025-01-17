"use client";
import React, { useEffect, useState } from "react";
import Card from "./Card";
import SideBar from "@/components/SideBar";

const Page = () => {
  const [watchHistory, setWatchHistory] = useState<any[]>([]);
  const [msg, setmsg] = useState("loading...");

  useEffect(() => {
    const storedHistory = localStorage.getItem("WatchHistory");

    if (storedHistory && storedHistory.length > 2) {
      setWatchHistory(JSON.parse(storedHistory));
    } else {
      setmsg("Nothing here");
      console.log("wha");
    }
  }, []);

  const delete_ = (id: number) => {
    const storedHistory = localStorage.getItem("WatchHistory");

    if (storedHistory) {
      const historyArray = JSON.parse(storedHistory);
      const updatedHistory = historyArray.filter(
        (item: { id: number }) => item.id !== id
      );

      localStorage.setItem("WatchHistory", JSON.stringify(updatedHistory));

      if (updatedHistory.length !== 0) {
        setWatchHistory(updatedHistory);
      } else {
        setWatchHistory(updatedHistory);
        setmsg("Nothing here");
      }
    }
  };

  return (
    <div className="relative flex flex-row w-screen h-screen bg-black overflow-hidden text-white">
      <SideBar />
      <div className="flex flex-col ml-10">
        <div className="mt-5 text-4xl mb-6w font-semibold">
          Continue Watching
        </div>
        <div className="flex flex-row flex-wrap justify-start w-full">
          {watchHistory.length > 0 ? (
            watchHistory
              .slice()
              .reverse()
              .map((item, index) => (
                <div key={index} className="m-4">
                  <Card data={item} delete_={delete_} />
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
