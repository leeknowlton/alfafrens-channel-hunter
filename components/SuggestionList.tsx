"use client";

import React from "react";

interface User {
  fid: string;
  username: string;
  display_name: string;
  follower_count: number;
  pfp_url: string;
}

interface SuggestionListProps {
  suggestions: User[];
  onSelect: (user: User) => void;
}

const SuggestionList: React.FC<SuggestionListProps> = ({
  suggestions,
  onSelect,
}) => {
  return (
    <ul className="absolute bg-gray-900 border border-gray-300 rounded-md mt-1 w-full z-10 max-h-60 overflow-y-auto">
      {suggestions.map((user) => (
        <li
          key={user.fid}
          onClick={() => onSelect(user)}
          className="flex items-center p-2 cursor-pointer hover:bg-gray-700"
        >
          <img
            src={user.pfp_url}
            alt={user.username}
            className="w-8 h-8 rounded-full mr-2"
          />
          <div>
            <strong>{user.display_name || user.username}</strong>
            <small className="block text-gray-500">@{user.username}</small>
            <small className="block text-gray-500">
              {user.follower_count} followers
            </small>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default SuggestionList;
