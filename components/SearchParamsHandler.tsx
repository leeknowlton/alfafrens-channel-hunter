"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

interface SearchParamsHandlerProps {
  onParamsChange: (fid1: string, fid2: string) => void;
}

const SearchParamsHandler: React.FC<SearchParamsHandlerProps> = ({
  onParamsChange,
}) => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const fid1 = searchParams.get("fid1");
    const fid2 = searchParams.get("fid2");
    if (fid1 && fid2) {
      onParamsChange(fid1, fid2);
    }
  }, [searchParams, onParamsChange]);

  return null;
};

export default SearchParamsHandler;
