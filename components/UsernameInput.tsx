"use client";

import { useState, useEffect } from "react";
import debounce from "lodash/debounce";
import axios from "axios";
import SuggestionList from "./SuggestionList";

interface User {
  fid: string;
  username: string;
  display_name: string;
  follower_count: number;
  pfp_url: string;
}

interface UsernameInputProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  onFidChange: (fid: string) => void;
}

const UsernameInput: React.FC<UsernameInputProps> = ({
  label,
  value,
  onValueChange,
  onFidChange,
}) => {
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  useEffect(() => {
    if (value.length > 2) {
      debouncedFetchSuggestions(value);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  }, [value]);

  const fetchSuggestions = async (query: string) => {
    try {
      const response = await axios.get(
        `https://api.neynar.com/v2/farcaster/user/search?q=${query}&viewer_fid=3&limit=5`,
        {
          headers: {
            accept: "application/json",
            api_key: "NEYNAR_FROG_FM",
          },
        }
      );
      setSuggestions(response.data.result.users || []);
      setShowDropdown(true);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const debouncedFetchSuggestions = debounce(fetchSuggestions, 300);

  const handleSelectSuggestion = (user: User) => {
    onFidChange(user.fid);
    onValueChange(user.username);
    setShowDropdown(false);
    setSuggestions([]);
  };

  return (
    <div className="relative w-full">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className="p-2 border border-gray-300 rounded-md w-full"
        required
      />
      {showDropdown && suggestions.length > 0 && (
        <SuggestionList
          suggestions={suggestions}
          onSelect={handleSelectSuggestion}
        />
      )}
    </div>
  );
};

export default UsernameInput;
