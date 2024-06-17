"use client";

import { useState } from "react";
import FIDForm from "../components/FIDForm";
import SubscribedChannels from "../components/SubscribedChannels";

const Home: React.FC = () => {
  const [myFid, setMyFid] = useState<string | null>(null);
  const [theirFid, setTheirFid] = useState<string | null>(null);

  const handleFormSubmit = (myFid: string, theirFid: string) => {
    setMyFid(myFid);
    setTheirFid(theirFid);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">AlfaTaster</h1>
      <FIDForm onSubmit={handleFormSubmit} />
      {myFid && theirFid && (
        <SubscribedChannels
          myFid={myFid}
          theirFid={theirFid}
          first={20}
          skip={0}
        />
      )}
    </div>
  );
};

export default Home;
