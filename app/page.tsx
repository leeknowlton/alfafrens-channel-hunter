"use client";

import { useState } from "react";
import Head from "next/head";
import FIDForm from "../components/FIDForm";
import SubscribedChannels from "../components/SubscribedChannels";
import SearchParamsHandler from "../components/SearchParamsHandler";

const Home: React.FC = () => {
  const [fid1, setFid1] = useState<string | null>(null);
  const [fid2, setFid2] = useState<string | null>(null);

  const handleFormSubmit = (fid1: string, fid2: string) => {
    setFid1(fid1);
    setFid2(fid2);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-100 my-10">
      <Head>
        <title>AlfaFrens Channel Hunt</title>
        <link rel="icon" href="/favicon.png" type="image/png" />
      </Head>
      <h1 className="text-4xl font-bold mb-4">AlfaFrens Channel Hunt</h1>
      <FIDForm onSubmit={handleFormSubmit} />
      <SearchParamsHandler onParamsChange={handleFormSubmit} />
      {fid1 && fid2 && (
        <SubscribedChannels fid1={fid1} fid2={fid2} first={20} skip={0} />
      )}
    </div>
  );
};

export default Home;
