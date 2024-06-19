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
}

interface PopularChannel {
  channel: Channel;
  count: number;
}

const PopularityContest: React.FC = () => {
  const [channels, setChannels] = useState<PopularChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/getPopularity");
        const data = await response.json();

        if (!response.ok) {
          setError(data.error);
        } else {
          setChannels(data.slice(0, 100)); // Truncate to top 100
        }
      } catch (error) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <p className="text-center text-blue-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  const getHighlightClass = (index: number) => {
    if (index === 0)
      return "border border-yellow-400 text-yellow-400 bg-yellow-400 bg-opacity-10";
    if (index === 1)
      return "border border-gray-400 text-gray-400 bg-gray-400 bg-opacity-10";
    if (index === 2)
      return "border border-yellow-800 text-yellow-800 bg-yellow-800 bg-opacity-10";
    if (index < 10)
      return "border border-gray-700 text-white bg-gray-700 bg-opacity-10";
    return "bg-gray-900 text-white";
  };

  const getPrice = (rate: number) => {
    return Math.round(rate / 380517503805.174);
  };

  return (
    <div className="mx-auto p-4 py-5 relative bg-base-100">
      <Image
        src="/popularity.png"
        alt="Venn Frens"
        width={197}
        height={110}
        className="mx-auto"
      />

      <h1 className="text-4xl font-bold mt-4 mb-2 text-secondary text-center font-orbitron">
        Popularity Contest
      </h1>
      <div className="container max-w-lg mx-auto">
        <p className="text-sm italic mb-4 text-center">
          Less fair than your high school homecoming.
        </p>
        <p className="text-sm mb-4 bg-primary border border-dashed p-2 bg-opacity-10 border-opacity-50">
          <p className="uppercase text-xs ">Super Duper Official Methodology</p>{" "}
          Take subs from the Top 50 (by stake) and rank them by sub frequency.
          Updated periodically, at best.
        </p>
        <div className="relative z-10 ">
          <ul className="list-none relative z-10">
            {channels.map(({ channel }, index) => (
              <a
                key={channel.channel.id}
                href={`https://alfafrens.com/channel/${channel.channel?.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <li
                  className={`mb-4 p-2 rounded-md shadow-md transition-transform transform hover:scale-105 hover:shadow-lg ${getHighlightClass(
                    index
                  )}`}
                >
                  <div className="flex items-center">
                    <span className="text-base mr-4">{index + 1}.</span>
                    <img
                      src={channel.profileimgurl}
                      alt={channel.title}
                      className="w-10 h-10 rounded-full mr-4"
                    />
                    <div>
                      <p className="text-sm">{channel.title}</p>
                      <p className="text-xs text-gray-500">
                        {getPrice(channel.totalSubscriptionOutflowRate)} DEGENx
                      </p>
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

export default PopularityContest;
