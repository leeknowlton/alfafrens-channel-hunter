"use client";

import { useState, useEffect, useRef } from "react";
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
  const inputRef = useRef<HTMLInputElement>(null);

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
      const response = await axios.get(`/api/searchUsernames?q=${query}`);
      setSuggestions(response.data || []);
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
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  return (
    <div className="relative w-full">
      <label className="label text-xs">{label}</label>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className="input input-primary"
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
