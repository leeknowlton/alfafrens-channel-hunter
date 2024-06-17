"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Head from "next/head";
import FIDForm from "../components/FIDForm";
import SubscribedChannels from "../components/SubscribedChannels";

const Home: React.FC = () => {
  const [fid1, setFid1] = useState<string | null>(null);
  const [fid2, setFid2] = useState<string | null>(null);

  const searchParams = useSearchParams();

  useEffect(() => {
    const fid1 = searchParams.get("fid1");
    const fid2 = searchParams.get("fid2");
    if (fid1 && fid2) {
      setFid1(fid1);
      setFid2(fid2);
    }
  }, [searchParams]);

  const handleFormSubmit = (fid1: string, fid2: string) => {
    setFid1(fid1);
    setFid2(fid2);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-100">
      <Head>
        <title>AlfaFrens Channel Hunt</title>
        <link rel="icon" href="/favicon.png" type="image/png" />
      </Head>
      <h1 className="text-4xl font-bold mb-8">
        Welcome to AlfaFrens Channel Hunt
      </h1>
      <FIDForm onSubmit={handleFormSubmit} />
      <Suspense fallback={<p>Loading...</p>}>
        {fid1 && fid2 && (
          <SubscribedChannels fid1={fid1} fid2={fid2} first={20} skip={0} />
        )}
      </Suspense>
    </div>
  );
};

export default Home;
