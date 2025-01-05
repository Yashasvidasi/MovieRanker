"use client";
import { useRouter, usePathname } from "next/navigation";
import React, { useState } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast"; // Import toast and Toaster

function SideBar() {
  const [show, setShow] = useState(false);
  const router = useRouter();

  const fetchData = async () => {
    // Show loading toast
    const loadingToast = toast.loading("Loading...", { duration: 1800 });

    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await fetch(
        `/api/gettoken2?cachebuster=${new Date().getTime()}`,
        options
      );

      const data = await response.json();

      // Dismiss the loading toast
      toast.dismiss(loadingToast);

      if (data.id !== "not_logged_in") router.push(`/user/${data.id}`);
      else router.push("/login");
    } catch (error) {
      // Dismiss the loading toast and show error message
      toast.dismiss(loadingToast);
      toast.error("Something went wrong!");
    }
  };

  const handleShow = () => {
    setShow(!show);
  };

  return (
    <div className="min-h-screen md:min-w-20 min-w-16 bg-black flex flex-col justify-between">
      <Toaster position="top-center" />{" "}
      {/* Toaster component to show toast notifications */}
      <div className="flex flex-col">
        <a
          href="/home"
          className="self-center rounded-full mt-4 hover:cursor-pointer"
        >
          <motion.div whileHover={{ scale: 1.05 }}>
            <img src="/assets/logo.png" className="w-11 h-11" />
          </motion.div>
        </a>
        <a
          href="/search"
          className="self-center rounded-full mt-6 hover:cursor-pointer"
        >
          <motion.div whileHover={{ scale: 1.05 }}>
            <img src="/assets/search.png" className="w-8 h-8" />
          </motion.div>
        </a>
        <a
          href="/filter"
          className="self-center rounded-full mt-6 hover:cursor-pointer"
        >
          <motion.div whileHover={{ scale: 1.05 }}>
            <img src="/assets/slider.png" className="w-8 h-8" />
          </motion.div>
        </a>
        <a
          href="/history"
          className="self-center rounded-full mt-6 hover:cursor-pointer"
        >
          <motion.div whileHover={{ scale: 1.05 }}>
            <img src="/assets/history.png" className="w-9 h-9 invert" />
          </motion.div>
        </a>
      </div>
      <div className="flex flex-col mb-10">
        {show ? (
          <div className="flex flex-col mt-6 mr-0.5 bg-slate-300 p-4 w-fit self-center rounded-xl">
            <motion.div
              whileHover={{ scale: 1.03 }}
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
              whileHover={{ scale: 1.03 }}
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
              whileHover={{ scale: 1.03 }}
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
          whileHover={{ scale: 1.05 }}
          onClick={handleShow}
          className="self-center hover:cursor-pointer rounded-full mt-6 mr-0.5 "
        >
          <img src="/assets/share.png" className="w-8 h-8" />
        </motion.div>
        <div
          onClick={() => fetchData()}
          className="self-center rounded-full mt-6 p-2 border-2 border-white hover:cursor-pointer"
        >
          <motion.div whileHover={{ scale: 1.05 }}>
            <img src="/assets/user.png" className="w-6 h-6" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
