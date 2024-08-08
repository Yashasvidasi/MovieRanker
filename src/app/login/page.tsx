"use client";

import { useState, useEffect } from "react";
import LoginPage from "./LoginPage";
import SignInPage from "./SignInPage";
import { Toaster } from "react-hot-toast";

function Popup({ onClose }: any) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-4 border rounded shadow-lg min-h-72 w-80 relative text-black text-xl flex flex-col justify-center text-center">
        <p>For testing purposes:</p>
        <p>EMAIL = yash1@gmail.com</p>
        <p>PASSWORD 12345</p>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
        >
          &times;
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const [login, setlogin] = useState(true);
  const [showPopup, setShowPopup] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(false);
    }, 10000); // Popup will automatically close after 10 seconds, adjust as needed

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);

  return (
    <main className="flex h-screen flex-row items-center justify-between p-5">
      <div className="hidden md:flex flex-col justify-center w-1/2 h-full">
        <div className="relative w-full h-full">
          <img
            src="/assets/poster.jpg"
            className="w-full h-full object-fit"
            alt="Poster"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black"></div>
        </div>
      </div>

      <div className="flex flex-col w-full md:w-1/2 justify-center min-h-full">
        <Toaster />
        <div>
          <img src="/assets/poster.png" className="w-full h-full" />
        </div>
        {login ? (
          <LoginPage setlogin={setlogin} />
        ) : (
          <SignInPage setlogin={setlogin} />
        )}
        {showPopup && <Popup onClose={() => setShowPopup(false)} />}
      </div>
    </main>
  );
}
