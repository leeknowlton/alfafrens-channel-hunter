"use client";

import { useState, useEffect } from "react";
import debounce from "lodash/debounce";
import axios from "axios";

interface UsernameInputProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  onFidChange: (fid: string) => void;
}

interface User {
  fid: string;
  username: string;
  display_name: string;
  follower_count: number;
  pfp_url: string;
}

const UsernameInput: React.FC<UsernameInputProps> = ({
  label,
  value,
  onValueChange,
  onFidChange,
}) => {
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (value.length > 2) {
      debouncedFetchSuggestions(value);
    } else {
      setSuggestions([]);
    }
  }, [value]);

  const fetchSuggestions = async (query: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/searchUsernames?q=${query}`);
      setSuggestions(response.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchSuggestions = debounce(fetchSuggestions, 300);

  const handleSelectSuggestion = (user: User) => {
    onFidChange(user.fid);
    onValueChange(user.username);
    setSuggestions([]);
  };

  return (
    <div className="relative w-full">
      <label htmlFor={label} className="block text-sm font-medium mb-1">
        {label}
      </label>
      <input
        type="text"
        id={label}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className="p-2 border border-gray-300 rounded-md w-full"
        required
      />
      {loading && <p className="text-sm text-gray-500">Loading...</p>}
      {suggestions.length > 0 && (
        <ul className="absolute bg-gray-900 border border-gray-300 rounded-md mt-1 w-full z-10 max-h-60 overflow-y-auto">
          {suggestions.map((user) => (
            <li
              key={user.fid}
              onClick={() => handleSelectSuggestion(user)}
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
      )}
    </div>
  );
};

export default UsernameInput;
