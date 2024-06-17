"use client";

import { useState, useEffect } from "react";

interface Channel {
  title: string;
  profileimgurl: string;
}

interface ApiResponse {
  channels: Channel[];
  hasMore: boolean;
  error?: string;
}

interface SubscribedChannelsProps {
  myFid: string;
  theirFid: string;
  first: number;
  skip: number;
}

const SubscribedChannels: React.FC<SubscribedChannelsProps> = ({
  myFid,
  theirFid,
  first,
  skip,
}) => {
  const [myChannels, setMyChannels] = useState<Channel[]>([]);
  const [theirChannels, setTheirChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchChannels(fid: string) {
      let allChannels: Channel[] = [];
      let hasMore = true;
      let currentSkip = 0;

      while (hasMore) {
        const response = await fetch(
          `/api/getUserSubscribedChannels?fid=${fid}&first=${first}&skip=${currentSkip}`
        );
        const result: ApiResponse = await response.json();

        if (!response.ok) {
          setError(result.error || "Failed to fetch data");
          return [];
        }

        allChannels = allChannels.concat(result.channels);
        hasMore = result.hasMore;
        currentSkip += first;
      }

      return allChannels;
    }

    async function fetchData() {
      try {
        const [myChannelsData, theirChannelsData] = await Promise.all([
          fetchChannels(myFid),
          fetchChannels(theirFid),
        ]);

        setMyChannels(myChannelsData);
        setTheirChannels(theirChannelsData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [myFid, theirFid, first, skip]);

  if (loading) return <p className="text-center text-blue-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  const myChannelTitles = myChannels.map((channel) => channel.title);
  const theirChannelTitles = theirChannels.map((channel) => channel.title);

  const commonChannels = myChannels.filter((channel) =>
    theirChannelTitles.includes(channel.title)
  );
  const uniqueMyChannels = myChannels.filter(
    (channel) => !theirChannelTitles.includes(channel.title)
  );
  const uniqueTheirChannels = theirChannels.filter(
    (channel) => !myChannelTitles.includes(channel.title)
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">
        Channel Comparison
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h2 className="text-xl font-bold text-center mb-4">
            Common Channels
          </h2>
          <ul className="list-inside rounded-lg p-4">
            {commonChannels.map((channel, index) => (
              <li
                key={index}
                className="flex items-center py-2 border-b last:border-0"
              >
                <img
                  src={channel.profileimgurl}
                  alt={channel.title}
                  className="w-10 h-10 rounded-full mr-4"
                />
                <span>{channel.title}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-bold text-center mb-4">My Channels</h2>
          <ul className="list-inside rounded-lg p-4">
            {uniqueMyChannels.map((channel, index) => (
              <li
                key={index}
                className="flex items-center py-2 border-b last:border-0"
              >
                <img
                  src={channel.profileimgurl}
                  alt={channel.title}
                  className="w-10 h-10 rounded-full mr-4"
                />
                <span>{channel.title}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-bold text-center mb-4">Their Channels</h2>
          <ul className="list-inside rounded-lg p-4">
            {uniqueTheirChannels.map((channel, index) => (
              <li
                key={index}
                className="flex items-center py-2 border-b last:border-0"
              >
                <img
                  src={channel.profileimgurl}
                  alt={channel.title}
                  className="w-10 h-10 rounded-full mr-4"
                />
                <span>{channel.title}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SubscribedChannels;
