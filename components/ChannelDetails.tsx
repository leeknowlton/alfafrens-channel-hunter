"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

interface ChannelDetailsProps {
  channelAddress: string;
}

interface ChannelData {
  title: string;
  profileimgurl: string;
  otherProperties: Record<string, any>;
}

const ChannelDetails: React.FC<ChannelDetailsProps> = ({ channelAddress }) => {
  const [channelData, setChannelData] = useState<ChannelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        const response = await axios.get(
          `/api/getChannel?channelAddress=${channelAddress}`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );
        setChannelData(response.data);
      } catch (error) {
        setError("Failed to fetch channel data");
      } finally {
        setLoading(false);
      }
    };

    fetchChannelData();
  }, [channelAddress]);

  if (loading) return <p className="text-center text-blue-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="bg-base-200 p-4 rounded-lg shadow-md mb-6">
      <h2 className="uppercase text-xs mb-4">{channelData?.title}</h2>
      <img
        src={channelData?.profileimgurl}
        alt={channelData?.title}
        className="w-16 h-16 rounded-full mb-2"
      />
      <div>
        {Object.entries(channelData?.otherProperties || {}).map(
          ([key, value]) => (
            <div key={key} className="text-sm">
              <strong>{key}:</strong> {value}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ChannelDetails;
