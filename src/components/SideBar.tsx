"use client";
import { useRouter, usePathname } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";

function SideBar() {
  const [show, setshow] = useState(false);
  const router = useRouter();
  const [nid, setnid] = useState("");
  const pathname = usePathname();

  const fetchData = async () => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(
      `/api/gettoken2?cachebuster=${new Date().getTime()}`,
      options
    );
    console.log(response);
    const data = await response.json();

    if (data.id !== "not_logged_in") router.push(`/user/${data.id}`);
    else router.push("/login");
  };

  const handleshow = () => {
    setshow(!show);
  };

  return (
    <div className="min-h-screen min-w-20 bg-transparent flex flex-col  justify-between border-white">
      <div className="flex flex-col">
        <motion.div
          whileHover={{
            scale: 1.05,
          }}
          onClick={() => {
            pathname !== "/home" ? router.push("/home") : null;
          }}
          className="self-center rounded-full mt-4 hover:cursor-pointer"
        >
          <img src="/assets/logo.png" className="w-11 h-11" />
        </motion.div>
        <motion.div
          whileHover={{
            scale: 1.05,
          }}
          onClick={() => {
            pathname !== "/search" ? router.push("/search") : null;
          }}
          className="self-center rounded-full mt-6 hover:cursor-pointer"
        >
          <img src="/assets/search.png" className="w-8 h-8" />
        </motion.div>
        <motion.div
          whileHover={{
            scale: 1.05,
          }}
          onClick={() => {
            pathname !== "/filter" ? router.push("/filter") : null;
          }}
          className="self-center rounded-full mt-6 hover:cursor-pointer"
        >
          <img src="/assets/slider.png" className="w-8 h-8" />
        </motion.div>
      </div>
      <div className="flex flex-col mb-10">
        {show ? (
          <div className="flex flex-col mt-6 mr-0.5 bg-slate-300 p-4 w-fit self-center rounded-xl">
            <motion.div
              whileHover={{
                scale: 1.03,
              }}
              className="self-center rounded-full mr-0.5 hover:cursor-pointer"
            >
              <img
                src="/assets/facebook.png"
                className="h-6 w-6 cursor-pointer"
                onClick={() =>
                  window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      window.location.href
                    )}`,
                    "_blank"
                  )
                }
                alt="Share on Facebook"
              />
            </motion.div>
            <motion.div
              whileHover={{
                scale: 1.03,
              }}
              className="self-center rounded-full mt-6 mr-0.5 hover:cursor-pointer"
            >
              <img
                src="/assets/insta.png"
                className="h-6 w-6 cursor-pointer"
                onClick={() =>
                  window.open(
                    `https://www.instagram.com/?url=${encodeURIComponent(
                      window.location.href
                    )}`,
                    "_blank"
                  )
                }
                alt="Share on Instagram"
              />
            </motion.div>
            <motion.div
              whileHover={{
                scale: 1.03,
              }}
              className="self-center rounded-full mt-6 mr-0.5 hover:cursor-pointer"
            >
              <img
                src="/assets/whatsapp.png"
                className="h-6 w-6 cursor-pointer"
                onClick={() =>
                  window.open(
                    `https://api.whatsapp.com/send?text=${encodeURIComponent(
                      window.location.href
                    )}`,
                    "_blank"
                  )
                }
                alt="Share on WhatsApp"
              />
            </motion.div>
          </div>
        ) : null}

        <motion.div
          whileHover={{
            scale: 1.05,
          }}
          onClick={handleshow}
          className="self-center hover:cursor-pointer rounded-full mt-6 mr-0.5 "
        >
          <img src="/assets/share.png" className="w-8 h-8" />
        </motion.div>
        <motion.div
          whileHover={{
            scale: 1.05,
          }}
          onClick={() => {
            fetchData();
          }}
          className="self-center rounded-full mt-6 p-2 border-2 border-white hover:cursor-pointer"
        >
          <img src="/assets/user.png" className="w-6 h-6" />
        </motion.div>
      </div>
    </div>
  );
}

export default SideBar;
