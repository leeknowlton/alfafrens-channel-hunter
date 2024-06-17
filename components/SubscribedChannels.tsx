"use client";

import { useState, useEffect } from "react";

interface Channel {
  title: string;
  profileimgurl: string;
  channel: {
    id: string;
  };
}

interface User {
  handle: string;
}

interface ApiResponse {
  channels: Channel[];
  hasMore: boolean;
  error?: string;
}

interface UserResponse {
  handle: string;
}

interface SubscribedChannelsProps {
  fid1: string;
  fid2: string;
  first: number;
  skip: number;
}

const SubscribedChannels: React.FC<SubscribedChannelsProps> = ({
  fid1,
  fid2,
  first,
  skip,
}) => {
  const [channels1, setChannels1] = useState<Channel[]>([]);
  const [channels2, setChannels2] = useState<Channel[]>([]);
  const [handle1, setHandle1] = useState<string>("");
  const [handle2, setHandle2] = useState<string>("");
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

    async function fetchHandle(fid: string) {
      const response = await fetch(`/api/getUserByFid?fid=${fid}`);
      const result: UserResponse = await response.json();

      if (!response.ok) {
        setError(result.handle || "Failed to fetch handle");
        return "";
      }

      return result.handle;
    }

    async function fetchData() {
      try {
        const [channels1Data, channels2Data, handle1Data, handle2Data] =
          await Promise.all([
            fetchChannels(fid1),
            fetchChannels(fid2),
            fetchHandle(fid1),
            fetchHandle(fid2),
          ]);

        setChannels1(channels1Data);
        setChannels2(channels2Data);
        setHandle1(handle1Data);
        setHandle2(handle2Data);
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
  }, [fid1, fid2, first, skip]);

  if (loading) return <p className="text-center text-blue-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  const channelTitles1 = channels1.map((channel) => channel.title);
  const channelTitles2 = channels2.map((channel) => channel.title);

  const commonChannels = channels1.filter((channel) =>
    channelTitles2.includes(channel.title)
  );
  const uniqueChannels1 = channels1.filter(
    (channel) => !channelTitles2.includes(channel.title)
  );
  const uniqueChannels2 = channels2.filter(
    (channel) => !channelTitles1.includes(channel.title)
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        Channel Comparison
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h2 className="font-bold text-center mb-4">Common Channels</h2>
          <ul className="list-inside rounded-lg p-4 bg-base-200 shadow-md">
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
                <a
                  href={`https://alfafrens.com/channel/${channel.channel?.id}`}
                  target="_blank"
                  className="text-blue-500 hover:underline"
                >
                  {channel.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-bold text-center mb-4">
            {handle1 ? handle1 + "'s Unique Channels" : "My Channels"}
          </h2>
          <ul className="list-inside rounded-lg p-4 bg-base-200 shadow-md">
            {uniqueChannels1.map((channel, index) => (
              <li
                key={index}
                className="flex items-center py-2 border-b last:border-0"
              >
                <img
                  src={channel.profileimgurl}
                  alt={channel.title}
                  className="w-10 h-10 rounded-full mr-4"
                />
                <a
                  href={`https://alfafrens.com/channel/${channel.channel?.id}`}
                  target="_blank"
                  className="text-blue-500 hover:underline"
                >
                  {channel.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="">
          <h2 className="font-bold text-center mb-4">
            {handle2 ? handle2 + "'s Unique Channels" : "Their Channels"}
          </h2>
          <ul className="list-inside rounded-lg p-4 bg-base-200 shadow-lg">
            {uniqueChannels2.map((channel, index) => (
              <li
                key={index}
                className="flex items-center py-2 border-b last:border-0"
              >
                <img
                  src={channel.profileimgurl}
                  alt={channel.title}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <a
                  href={`https://alfafrens.com/channel/${channel.channel?.id}`}
                  target="_blank"
                  className="text-blue-500 hover:underline"
                >
                  {channel.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SubscribedChannels;
