"use client";

import { useState } from "react";

interface FIDFormProps {
  onSubmit: (myFid: string, theirFid: string) => void;
}

const FIDForm: React.FC<FIDFormProps> = ({ onSubmit }) => {
  const [myFid, setMyFid] = useState<string>("");
  const [theirFid, setTheirFid] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(myFid, theirFid);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-4">
      <div>
        <label
          htmlFor="myFid"
          className="block text-sm font-medium text-gray-700"
        >
          My FID
        </label>
        <input
          type="text"
          id="myFid"
          value={myFid}
          onChange={(e) => setMyFid(e.target.value)}
          className="mt-1 p-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div>
        <label
          htmlFor="theirFid"
          className="block text-sm font-medium text-gray-700"
        >
          Their FID
        </label>
        <input
          type="text"
          id="theirFid"
          value={theirFid}
          onChange={(e) => setTheirFid(e.target.value)}
          className="mt-1 p-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <button
        type="submit"
        className="mt-2 p-2 bg-blue-500 text-white rounded-md"
      >
        Submit
      </button>
    </form>
  );
};

export default FIDForm;
