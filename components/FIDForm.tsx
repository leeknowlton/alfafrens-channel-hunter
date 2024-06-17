"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface FIDFormProps {
  onSubmit: (fid1: string, fid2: string) => void;
}

const FIDForm: React.FC<FIDFormProps> = ({ onSubmit }) => {
  const [fid1, setFid1] = useState<string>("");
  const [fid2, setFid2] = useState<string>("");

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const queryParams = new URLSearchParams({ fid1, fid2 }).toString();
    router.push(`/?${queryParams}`);
    onSubmit(fid1, fid2);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center space-x-4 content-end"
    >
      <div>
        <label
          htmlFor="fid1"
          className="block text-sm font-medium text-gray-700"
        >
          My FID
        </label>
        <input
          type="text"
          id="fid1"
          value={fid1}
          onChange={(e) => setFid1(e.target.value)}
          className="mt-1 p-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div>
        <label
          htmlFor="fid2"
          className="block text-sm font-medium text-gray-700"
        >
          Their FID
        </label>
        <input
          type="text"
          id="fid2"
          value={fid2}
          onChange={(e) => setFid2(e.target.value)}
          className="mt-1 p-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <button type="submit" className="p-2 bg-blue-500 text-white rounded-md">
        Submit
      </button>
    </form>
  );
};

export default FIDForm;
