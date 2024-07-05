/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Channel {
  title: string;
  profileimgurl: string;
  channel: {
    id: string;
  };
  totalSubscriptionOutflowRate: number;
  description: string;
  f2f: boolean;
  dateAdded: string;
}

interface PopularChannel {
  channel: Channel;
  count: number;
}

const ZenisList: React.FC = () => {
  const [channels, setChannels] = useState<PopularChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/getZenislist");
        const data = await response.json();

        if (!response.ok) {
          setError(data.error);
        } else {
          // Sort channels by count and randomly sort channels with the same count
          const sortedChannels = data.sort(
            (a: PopularChannel, b: PopularChannel) => {
              if (b.count === a.count) {
                return Math.random() - 0.5;
              }
              return b.count - a.count;
            }
          );

          // Truncate to top 100
          setChannels(sortedChannels.slice(0, 100));
        }
      } catch (error) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading)
    return <p className="text-center text-blue-500 bg-darkBg">Loading...</p>;
  if (error)
    return <p className="text-center text-red-500 bg-darkBg">Error: {error}</p>;

  const getPrice = (rate: number) => {
    return Math.round(rate / 380517503805.174);
  };

  const backgroundColors = ["bg-gray-500"];

  return (
    <div className="mx-auto p-4 py-5 relative bg-darkBg">
      <h1 className="text-4xl font-bold mt-4 mb-2 text-secondary text-center font-mono">
        Zeni&apos;s List
      </h1>
      <div className="container max-w-6xl mx-auto">
        <p className="text-sm italic mb-4 text-center">
          A manual labor of love.
        </p>
        <div className="text-sm mb-4 bg-primary border border-dashed p-2 bg-opacity-10 border-opacity-50">
          <div className="uppercase text-xs ">Want to be included?</div>
          <p>
            Have an active channel? Post a message in Zenigame&apos;s AlfaFrens
            channel with what you&apos;re about. I&apos;ll sub back and
            we&apos;ll go from there.
          </p>
        </div>
        <div className="relative z-10 ">
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {channels.map(({ channel }, index) => (
              <a
                key={channel.channel.id}
                href={`https://alfafrens.com/channel/${channel.channel?.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <li
                  className={`p-4 rounded-md shadow-md transition-transform transform hover:scale-105 hover:shadow-lg border border-gray-700 text-white ${
                    backgroundColors[index % backgroundColors.length]
                  } bg-opacity-10`}
                >
                  <div className="flex flex-col gap-5 relative h-36">
                    <div className="flex">
                      <img
                        src={channel.profileimgurl}
                        alt={channel.title}
                        className="w-10 h-10 rounded-full mr-4"
                      />
                      <div className="flex-grow overflow-hidden">
                        <p className="truncate">{channel.title}</p>
                        <p className="text-xs text-gray-500">
                          {getPrice(channel.totalSubscriptionOutflowRate)}{" "}
                          DEGENx
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-200">
                        {channel.description}
                      </p>
                      <p
                        className={`text-xs px-2 py-1 rounded w-fit mt-2 ${
                          channel.f2f ? "bg-green-700" : ""
                        }`}
                      >
                        {channel.f2f ? "Onchain Frens F2F Opt-in" : ""}
                      </p>
                    </div>
                    <div className="absolute top-2 right-2 text-xs text-gray-400">
                      Added:{" "}
                      {new Date(channel.dateAdded).toLocaleDateString("en-US", {
                        month: "2-digit",
                        day: "2-digit",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </li>
              </a>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ZenisList;
