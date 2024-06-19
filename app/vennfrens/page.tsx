"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Head from "next/head";
import FIDForm from "../../components/FIDForm";
import SubscribedChannels from "../../components/SubscribedChannels";
import Image from "next/image";

const Home: React.FC = () => {
  const [fid1, setFid1] = useState<string | null>(null);
  const [fid2, setFid2] = useState<string | null>(null);

  const handleFormSubmit = (fid1: string, fid2: string) => {
    setFid1(fid1);
    setFid2(fid2);
  };

  const searchParams = useSearchParams();

  useEffect(() => {
    const fid1 = searchParams.get("fid1");
    const fid2 = searchParams.get("fid2");
    if (fid1 && fid2) {
      setFid1(fid1);
      setFid2(fid2);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-darkBg py-10 px-4">
      <Head>
        <title>VennFrens</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-full">
        <div className="flex justify-center mb-4">
          <Image
            src="/venn.png"
            alt="Venn Frens"
            width={197}
            height={110}
            className="mx-auto"
          />
        </div>
        <h1 className="text-3xl font-bold mb-6 text-secondary text-center font-mono">
          Venn Frens
        </h1>
        {fid1 && fid2 && (
          <SubscribedChannels fid1={fid1} fid2={fid2} first={20} skip={0} />
        )}
        <div className="border border-gray-700 text-white bg-gray-700 bg-opacity-10 py-4 px-4 rounded-lg max-w-xl mx-auto">
          <p className="uppercase text-xs text-gray-200 mb-2">Instructions</p>
          <p className="text-sm mb-4">
            Choose two users. Discover subs you have in{" "}
            <span className="text-primary bg-secondary">common</span> and those
            that are <span className="text-secondary bg-primary">unique</span>.
          </p>
          <FIDForm onSubmit={handleFormSubmit} />
        </div>
      </div>
    </div>
  );
};

export default Home;
