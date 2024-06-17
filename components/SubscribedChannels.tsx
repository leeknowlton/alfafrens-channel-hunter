"use client";

import { useState, useEffect } from "react";

interface Channel {
  title: string;
  profileimgurl: string;
  channel: object;
}

interface ApiResponse {
  channels: Channel[];
  hasMore: boolean;
  error?: string;
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
        const [channels1Data, channels2Data] = await Promise.all([
          fetchChannels(fid1),
          fetchChannels(fid2),
        ]);

        setChannels1(channels1Data);
        setChannels2(channels2Data);
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

  console.log(uniqueChannels2);

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
                <a
                  href={`https://alfafrens.com/channel/${channel.channel?.id}`}
                  target="_blank"
                >
                  {channel.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-bold text-center mb-4">My Channels</h2>
          <ul className="list-inside rounded-lg p-4">
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
                >
                  {channel.title}
                </a>{" "}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-bold text-center mb-4">Their Channels</h2>
          <ul className="list-inside rounded-lg p-4">
            {uniqueChannels2.map((channel, index) => (
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
                >
                  {channel.title}
                </a>{" "}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SubscribedChannels;
