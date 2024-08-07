import { useState, useEffect } from "react";
import ChannelList from "./ChannelList";
import SubscriptionStats from "./SubscriptionStats";

interface Channel {
  title: string;
  profileimgurl: string;
  channel: {
    id: string;
  };
  totalSubscriptionOutflowRate: number;
  totalSubscriptionOutflowAmount: number;
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
      <div className="mx-auto max-w-fit">
        <div className="flex gap-5 mx-auto items-center text-center mb-4 justify-center">
          <div className="flex flex-col w-64 border border-gray-700 text-white bg-gray-700 bg-opacity-10 px-4 py-2 rounded-md ">
            <div className="text-xs uppercase text-gray-400">User 1</div>
            <div className="text-lg">{handle1}</div>
          </div>
          <div className="flex flex-col w-64 border border-gray-700 text-white bg-gray-700 bg-opacity-10 px-4 py-2 rounded-md ">
            <div className="text-xs uppercase text-gray-400">User 2</div>
            <div className="text-lg ">{handle2}</div>
          </div>
        </div>
        <div className="mx-auto w-full">
          <SubscriptionStats
            handle1={handle1}
            handle2={handle2}
            channels1={channels1}
            channels2={channels2}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 border border-gray-300 bg-gray-700 bg-opacity-20 border-opacity-20">
          <h3 className="text-center mb-2 py-2 bg-primary bg-opacity-10 px-2 flex flex-col">
            <span>{handle1}</span>
            <span className="text-xs">
              {uniqueChannels1.length} Unique Subscriptions
            </span>
          </h3>
          <ChannelList
            title={handle1 ? `${handle1}'s Unique Subs` : "My Channels"}
            channels={uniqueChannels1}
          />
        </div>
        <div className="flex-1 border border-gray-300 text-gray-200 bg-gray-700 bg-opacity-20 border-opacity-20">
          <h3 className="text-center mb-2 py-2 bg-gray-800 px-2 flex flex-col">
            <span>Shared</span>
            <span className="text-xs">
              {commonChannels.length} Shared Subscriptions
            </span>
          </h3>
          <ChannelList title="Both Subbed To" channels={commonChannels} />
        </div>
        <div className="flex-1 border border-gray-300 bg-gray-700 bg-opacity-20 border-opacity-20">
          <h3 className="text-center mb-2 py-2 bg-secondary bg-opacity-10 px-2 flex flex-col">
            <span>{handle2}</span>
            <span className="text-xs">
              {uniqueChannels2.length} Unique Subscriptions
            </span>
          </h3>
          <ChannelList
            title={handle2 ? `${handle2} Only` : "Their Channels"}
            channels={uniqueChannels2}
          />
        </div>
      </div>
    </div>
  );
};

export default SubscribedChannels;
