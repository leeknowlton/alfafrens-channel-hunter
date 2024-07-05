// components/StakeList.tsx
"use client";

import { useQuery, gql } from "@apollo/client";
import { useMemo, useState, useEffect } from "react";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";

const FLOW_CONSTANT = 380517503805;
const STAKE_CONSTANT = 100000000000000;
const ALFAFRENS_CHANNEL_ID = "0x9d9141d98ea1b553a8d761c23c221603bd58a58b";

const GET_CHANNELS = gql`
  query GetChannels {
    channels(
      where: { numberOfSubscribers_gt: 19 }
      orderBy: numberOfSubscribers
      first: 500
    ) {
      id
      owner
      numberOfSubscribers
      currentStaked
      subscriptionFlowRatePrice
    }
  }
`;

type SortField =
  | "handle"
  | "dpa"
  | "return"
  | "subscribers"
  | "staked"
  | "price";

interface ChannelOwner {
  aa_address: string;
  handle: string;
}

interface Channel {
  id: string;
  owner: string;
  numberOfSubscribers: number;
  currentStaked: number;
  subscriptionFlowRatePrice: number;
}

const MobileChannelCard = ({
  channel,
  channelOwners,
  newStake,
  rank,
}: {
  channel: Channel;
  channelOwners: Record<string, string>;
  newStake: number;
  rank: number;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getRankColor = (rank: number) => {
    if (rank === 1)
      return "bg-yellow-600 hover:bg-yellow-500 hover:bg-opacity-40";
    if (rank === 2) return "bg-gray-400 hover:bg-gray-300 hover:bg-opacity-40";
    if (rank === 3)
      return "bg-yellow-900 hover:bg-yellow-800 hover:bg-opacity-40";
    return "bg-gray-700";
  };

  const cashback = parseFloat(
    Math.floor(
      ((channel.subscriptionFlowRatePrice * channel.numberOfSubscribers) /
        FLOW_CONSTANT) *
        0.7 *
        (newStake / (channel.currentStaked / STAKE_CONSTANT + newStake))
    ).toString()
  ).toFixed(2);

  return (
    <div className={`p-4 mb-4 rounded-lg ${getRankColor(rank)}`}>
      <div
        className="flex justify-between items-center"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="font-bold mr-2">#{rank}</span>
        <Link
          href={`https://alfafrens.com/channel/${channel.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-400 underline flex-grow"
        >
          {channelOwners[channel.owner.toLowerCase()] ||
            channel.owner.slice(0, 10)}
        </Link>
        <span>{isExpanded ? "▲" : "▼"}</span>
      </div>
      {isExpanded && (
        <div className="mt-4 space-y-2">
          <p>Cashback: {Number(cashback).toLocaleString()}</p>
          <p>Subscribers: {channel.numberOfSubscribers.toLocaleString()}</p>
          <p>
            Staked:{" "}
            {parseFloat(
              (channel.currentStaked / STAKE_CONSTANT).toString()
            ).toFixed(0)}
          </p>
          <p>
            Price:{" "}
            {parseFloat(
              (channel.subscriptionFlowRatePrice / FLOW_CONSTANT).toString()
            ).toFixed(0)}
          </p>
        </div>
      )}
    </div>
  );
};

const StakeList = () => {
  const { login, authenticated, user } = usePrivy();
  const [isSubscribed, setIsSubscribed] = useState<boolean | null>(null);

  const { loading, error, data } = useQuery(GET_CHANNELS);
  const [sortField, setSortField] = useState<SortField>("return");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [channelOwners, setChannelOwners] = useState<Record<string, string>>(
    {}
  );
  const [newStake, setNewStake] = useState<number>(10000);

  useEffect(() => {
    async function checkSubscription() {
      if (!user?.farcaster?.fid) return;

      try {
        const response = await fetch(
          `/api/checkAlfaSubscriptionByFid?fid=${user.farcaster.fid}`
        );
        if (response.ok) {
          const result = await response.json();
          setIsSubscribed(result.isSubscribed);
        } else {
          setIsSubscribed(false);
        }
      } catch (error) {
        console.error("Failed to check subscription:", error);
        setIsSubscribed(false);
      }
    }

    if (authenticated && user?.farcaster?.fid) {
      checkSubscription();
    }
  }, [authenticated, user]);

  useEffect(() => {
    if (data?.channels) {
      const fetchOwners = async () => {
        const channelIds = data.channels.map((channel: any) => channel.id);
        const response = await fetch(
          `/api/getChannelOwners?channelAddresses=${channelIds.join(",")}`
        );
        if (response.ok) {
          const ownersData: { owners: ChannelOwner[] } = await response.json();
          const newOwnersMap: Record<string, string> = {};
          ownersData.owners.forEach((owner) => {
            newOwnersMap[owner.aa_address.toLowerCase()] = owner.handle;
          });
          setChannelOwners(newOwnersMap);
        } else {
          console.error(
            "Failed to fetch channel owners:",
            await response.text()
          );
        }
      };
      fetchOwners();
    }
  }, [data]);

  const sortedChannels = useMemo(() => {
    if (!data?.channels) return [];
    return [...data.channels].sort((a, b) => {
      let aValue, bValue;
      switch (sortField) {
        case "handle":
          return sortDirection === "asc"
            ? (channelOwners[a.owner.toLowerCase()] || "").localeCompare(
                channelOwners[b.owner.toLowerCase()] || ""
              )
            : (channelOwners[b.owner.toLowerCase()] || "").localeCompare(
                channelOwners[a.owner.toLowerCase()] || ""
              );
        case "subscribers":
          aValue = a.numberOfSubscribers;
          bValue = b.numberOfSubscribers;
          break;
        case "staked":
          aValue = a.currentStaked;
          bValue = b.currentStaked;
          break;
        case "price":
          aValue = a.subscriptionFlowRatePrice;
          bValue = b.subscriptionFlowRatePrice;
          break;
        case "return":
          aValue =
            Math.floor(
              ((a.subscriptionFlowRatePrice * a.numberOfSubscribers) /
                FLOW_CONSTANT) *
                0.7
            ) *
            (newStake / (a.currentStaked / STAKE_CONSTANT + newStake));
          bValue =
            Math.floor(
              ((b.subscriptionFlowRatePrice * b.numberOfSubscribers) /
                FLOW_CONSTANT) *
                0.7
            ) *
            (newStake / (b.currentStaked / STAKE_CONSTANT + newStake));
          break;
      }
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    });
  }, [data, sortField, sortDirection, channelOwners, newStake]);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handleStakeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value) || 0;
    setNewStake(value);
    setSortField("return");
    setSortDirection("desc");
  };

  const getRowColor = (index: number) => {
    if (index === 0)
      return "bg-yellow-600 hover:bg-yellow-500 hover:bg-opacity-40";
    if (index === 1) return "bg-gray-400 hover:bg-gray-300 hover:bg-opacity-40";
    if (index === 2)
      return "bg-yellow-900 hover:bg-yellow-800 hover:bg-opacity-40";
    return "hover:bg-gray-700 bg-gray-800";
  };

  if (!authenticated) {
    return (
      <div className="container mx-auto px-4 py-6 sm:py-12 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 uppercase font-mono text-secondary">
          Big Stake Calculator
        </h1>
        <p className="mb-6 text-lg">
          <a href="https://alfafrens.com/channel/0x9d9141d98ea1b553a8d761c23c221603bd58a58b">
            Zenigame AlfaFrens
          </a>{" "}
          Subs Only. Please log in to access the calculator.
        </p>
        <button
          onClick={() => login()}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Log In with Farcaster
        </button>
      </div>
    );
  }

  if (authenticated && isSubscribed === false) {
    return (
      <div className="container mx-auto px-4 py-6 sm:py-12 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 uppercase font-mono text-secondary">
          Big Stake Calculator
        </h1>
        <p className="mb-6 text-lg">
          You need to subscribe to Zenigame on AlfaFrens to access the
          calculator.
        </p>
        <Link
          href={`https://alfafrens.com/channel/${ALFAFRENS_CHANNEL_ID}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Subscribe to AlfaFrens
        </Link>
        <p className="mt-4 text-sm">
          After subscribing, please refresh this page.
        </p>
      </div>
    );
  }

  if (loading || isSubscribed === null) {
    return (
      <p className="text-center text-gray-400">
        Loading a bunch of big channels. This can take a bit...
      </p>
    );
  }

  if (error) {
    return <p className="text-center text-red-400">Error: {error.message}</p>;
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-center uppercase font-mono text-secondary">
        Big Stake Calculator
      </h1>
      {/* <p className="text-center italic text-sm sm:text-base mb-4">
        Welcome, {user?.farcaster?.username}
      </p> */}
      <p className="text-center italic text-sm sm:text-base">
        Small Stakes Not Supported 🤷‍♂️
      </p>
      <div className="w-full sm:max-w-2xl mx-auto flex flex-col gap-4 my-4 p-4 bg-primary bg-opacity-10 border border-primary text-xs sm:text-sm">
        <p className="uppercase text-xs">EXPLANATION</p>
        <p>
          This ain&apos;t your average staking tool. Optimized for return
          stability and big stakes. Think 1000 ALFA or more.
        </p>
        <p>
          We&apos;ve only included accounts with 20 subs or more. Yeah,
          it&apos;s not fair, but you can still use the AlfaFrens leaderboard if
          you want.
        </p>
        <p>
          Just plug in the ALFA you want to stake, and let the calculator do its
          magic.
        </p>
      </div>
      <div className="overflow-hidden">
        <div className="px-4 py-4">
          <div className="w-full max-w-sm mx-auto">
            <label
              htmlFor="stake"
              className="block text-gray-300 font-medium mb-2 text-sm sm:text-base"
            >
              How much ALFA do you want to stake?
            </label>
            <input
              id="stake"
              type="number"
              min={1000}
              max={100000}
              step={1000}
              value={newStake}
              onChange={handleStakeChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>
        </div>
        <div className="hidden sm:block overflow-x-auto rounded">
          <table className="w-full text-sm sm:text-base rounded-md">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Rank
                </th>
                {[
                  { key: "handle", label: "Handle" },
                  { key: "return", label: "Cashback" },
                  { key: "dpa", label: "DpA (Degen per ALFA" },
                  { key: "subscribers", label: "Subs" },
                  { key: "staked", label: "Staked" },
                  { key: "price", label: "Price" },
                ].map(({ key, label }) => (
                  <th
                    key={key}
                    className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer bg-opacity-10"
                    onClick={() => handleSort(key as SortField)}
                  >
                    <div className="flex items-center">
                      {label}
                      {sortField === key ? (
                        sortDirection === "asc" ? (
                          <FaSortUp className="ml-1" />
                        ) : (
                          <FaSortDown className="ml-1" />
                        )
                      ) : (
                        <FaSort className="ml-1" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
              {sortedChannels.map((channel, index) => (
                <tr
                  key={channel.id}
                  className={`text-gray-300  ${getRowColor(
                    index
                  )} bg-opacity-40`}
                >
                  <td className="px-2 sm:px-6 py-3 whitespace-nowrap font-bold">
                    #{index + 1}
                  </td>
                  <td className="px-2 sm:px-6 py-3 whitespace-nowrap">
                    <Link
                      href={`https://alfafrens.com/channel/${channel.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-400 underline"
                    >
                      {channelOwners[channel.owner.toLowerCase()]?.length > 20
                        ? `${channelOwners[channel.owner.toLowerCase()].slice(
                            0,
                            20
                          )}...`
                        : channelOwners[channel.owner.toLowerCase()] ||
                          channel.owner.slice(0, 20)}
                    </Link>
                  </td>
                  <td className="px-2 sm:px-6 py-3 whitespace-nowrap">
                    {Number(
                      parseFloat(
                        (
                          Math.floor(
                            ((channel.subscriptionFlowRatePrice *
                              channel.numberOfSubscribers) /
                              FLOW_CONSTANT) *
                              0.7
                          ) *
                          (newStake /
                            (channel.currentStaked / STAKE_CONSTANT + newStake))
                        ).toString()
                      ).toFixed(2)
                    ).toLocaleString()}
                  </td>
                  <td className="px-2 sm:px-6 py-3 whitespace-nowrap">
                    {Number(
                      parseFloat(
                        (
                          Math.floor(
                            ((channel.subscriptionFlowRatePrice *
                              channel.numberOfSubscribers) /
                              FLOW_CONSTANT) *
                              0.7
                          ) /
                          (channel.currentStaked / STAKE_CONSTANT)
                        ).toString()
                      ).toFixed(2)
                    ).toLocaleString()}
                  </td>
                  <td className="px-2 sm:px-6 py-3 whitespace-nowrap">
                    {channel.numberOfSubscribers.toLocaleString()}
                  </td>
                  <td className="px-2 sm:px-6 py-3 whitespace-nowrap">
                    {parseFloat(
                      (channel.currentStaked / STAKE_CONSTANT).toString()
                    ).toFixed(0)}
                  </td>
                  <td className="px-2 sm:px-6 py-3 whitespace-nowrap">
                    {parseFloat(
                      (
                        channel.subscriptionFlowRatePrice / FLOW_CONSTANT
                      ).toString()
                    ).toFixed(0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="sm:hidden">
          {sortedChannels.map((channel, index) => (
            <MobileChannelCard
              key={channel.id}
              channel={channel}
              channelOwners={channelOwners}
              newStake={newStake}
              rank={index + 1}
            />
          ))}
        </div>
      </div>
      <div className="mt-6 text-white text-center text-sm sm:text-base">
        Total Channels: {sortedChannels.length}
      </div>
    </div>
  );
};

export default StakeList;
