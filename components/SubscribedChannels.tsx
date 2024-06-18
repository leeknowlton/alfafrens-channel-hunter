"use client";

import { useState, useEffect } from "react";
import ChannelList from "./ChannelList";

interface Channel {
  title: string;
  profileimgurl: string;
  channel: {
    id: string;
  };
  totalSubscriptionOutflowRate: number;
}

interface UserResponse {
  handle: string;
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
    <div className="container mx-auto p-4 my-5">
      {/* <div className="flex flex-col gap-2 mx-auto items-center mb-4 justify-center">
        <div className="flex flex-col w-64 px-4 py-2 rounded-md bg-opacity-60 border border-primary">
          <div className="text-xs uppercase text-gray-400">User 1</div>
          <div className="text-lg">{handle1}</div>
        </div>
        <div className="flex flex-col w-64 px-4 py-2 rounded-md bg-opacity-60 border border-primary">
          <div className="text-xs uppercase text-gray-400">User 2</div>
          <div className="text-lg">{handle2}</div>
        </div>
      </div> */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ChannelList
          title={handle1 ? `${handle1}'s Unique Subs` : "My Channels"}
          channels={uniqueChannels1}
        />
        <ChannelList title="Both Subbed To" channels={commonChannels} />
        <ChannelList
          title={handle2 ? `${handle2}'s Unique Subs` : "Their Channels"}
          channels={uniqueChannels2}
        />
      </div>
    </div>
  );
};

export default SubscribedChannels;
