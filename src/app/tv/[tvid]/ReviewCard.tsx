import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const ReviewCard = (props: {
  data: {
    author_details: any;
    content: string;
    author: string;
    avatar_path: string | null;
    id: number;
  };
}) => {
  const { author_details, content, author } = props.data;
  const profilePic = author_details.avatar_path
    ? `https://image.tmdb.org/t/p/w500${author_details.avatar_path}`
    : "/assets/user.png";

  const [isExpanded, setIsExpanded] = useState(false);
  const wordLimit = 150;
  const words = content.split(" ");
  const shouldTruncate = words.length > wordLimit;
  const truncatedContent = words.slice(0, wordLimit).join(" ") + "...";

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.div className="text-white bg-opacity-65 p-4 rounded-xl w-full">
      <div className="flex items-start space-x-4">
        <img
          src={profilePic}
          alt={`${author}'s avatar`}
          className={`rounded-full min-w-12 min-h-12 max-w-12 max-h-12 border-2 border-white ${
            author_details.avatar_path ? "" : "p-1"
          }`}
        />
        <div>
          <div className="font-semibold text-lg mb-1">
            {author} - @{author_details.username}
          </div>
          <div className="mb-3 text-xs sm:text-sm md:text-base">
            Rating: {author_details.rating}
          </div>
          <div className="text-xs sm:text-sm md:text-base">
            {isExpanded || !shouldTruncate ? content : truncatedContent}
          </div>
          {shouldTruncate && (
            <button
              onClick={handleToggle}
              className="text-blue-500 mt-2 focus:outline-none text-xs sm:text-sm md:text-lg"
            >
              {isExpanded ? "Read Less" : "Read More"}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ReviewCard;
