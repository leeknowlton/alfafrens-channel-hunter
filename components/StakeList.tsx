// components/StakeList.tsx
"use client";

import { useQuery, gql } from "@apollo/client";
import { useMemo, useState, useEffect } from "react";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import Link from "next/link";

const FLOW_CONSTANT = 380517503805;
const STAKE_CONSTANT = 100000000000000;

const GET_CHANNELS = gql`
  query GetChannels {
    channels(
      where: { numberOfSubscribers_gt: 20 }
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
  | "subscribers"
  | "staked"
  | "price"
  | "return";

interface ChannelOwner {
  aa_address: string;
  handle: string;
}

interface MobileChannelCardProps {
  channel: {
    id: string;
    owner: string;
    numberOfSubscribers: number;
    currentStaked: number;
    subscriptionFlowRatePrice: number;
  };
  channelOwners: Record<string, string>;
  newStake: number;
  rank: number;
}

const MobileChannelCard = ({
  channel,
  channelOwners,
  newStake,
  rank,
}: MobileChannelCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getRankColor = (rank: number) => {
    if (rank === 1) return "bg-yellow-500";
    if (rank === 2) return "bg-gray-300";
    if (rank === 3) return "bg-yellow-600";
    return "bg-gray-700";
  };

  const cashback = parseFloat(
    Math.floor(
      ((channel.subscriptionFlowRatePrice * channel.numberOfSubscribers) /
        FLOW_CONSTANT) *
        0.7
    ) *
      (newStake / (channel.currentStaked / STAKE_CONSTANT + newStake))
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
            {parseFloat(channel.currentStaked / STAKE_CONSTANT).toFixed(0)}
          </p>
          <p>
            Price:{" "}
            {parseFloat(
              channel.subscriptionFlowRatePrice / FLOW_CONSTANT
            ).toFixed(0)}
          </p>
        </div>
      )}
    </div>
  );
};

const StakeList = () => {
  const { loading, error, data } = useQuery(GET_CHANNELS);
  const [sortField, setSortField] = useState<SortField>("return");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [channelOwners, setChannelOwners] = useState<Record<string, string>>(
    {}
  );
  const [newStake, setNewStake] = useState<number>(10000);

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

  if (loading) return <p className="text-center text-gray-400">Loading...</p>;
  if (error)
    return <p className="text-center text-red-400">Error: {error.message}</p>;

  const getRowColor = (index) => {
    if (index === 0)
      return "bg-yellow-500 hover:border hover:border-yellow-500 hover:bg-yellow-600";
    if (index === 1) return "bg-gray-300 hover:bg-gray-400";
    if (index === 2) return "bg-yellow-600 hover:bg-yellow-700";
    return "";
  };

  return (
    <div className="container mx-auto px-4 py-6 sm:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-center uppercase font-mono text-secondary">
        Big Stake Calculator
      </h1>
      <p className="text-center italic text-sm sm:text-base">
        Small Stakes Not Supported 🤷‍♂️
      </p>
      <div className="w-full max-w-2xl mx-auto flex flex-col gap-4 my-4 p-4 bg-primary bg-opacity-10 border border-primary text-xs sm:text-sm">
        <p className="uppercase text-xs">EXPLANATION</p>
        <p>
          This ain't your average staking tool. It's optimized for return
          stability and big stakes - think 1000 ALFA or more.
        </p>
        <p>
          No small channels on here. Everyone has 20 subs or more for that
          stability. It's not fair, sure, but you can still use the AlfaFrens
          leaderboard if you want.
        </p>
        <p>
          Ready? Just plug in the ALFA you want to stake, and let the calculator
          do its magic.
        </p>
      </div>
      <div className="bg-gray-800 shadow-xl rounded-lg overflow-hidden">
        <div className="px-4 py-4 bg-gray-700">
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
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm sm:text-base">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Rank
                </th>
                {[
                  { key: "handle", label: "Handle" },
                  { key: "return", label: "Est. Cashback (DEGENx/month)" },
                  { key: "return", label: "Degen per ALFA (DpA)" },
                  { key: "subscribers", label: "Subs" },
                  { key: "staked", label: "Staked" },
                  { key: "price", label: "Price" },
                ].map(({ key, label }) => (
                  <th
                    key={key}
                    className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-600"
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
                  className={`text-gray-300 hover:bg-gray-700 bg-opacity-40 ${getRowColor(
                    index
                  )}`}
                >
                  <td className="px-2 sm:px-6 py-3 whitespace-nowrap">
                    #{index + 1}
                  </td>
                  <td className="px-2 sm:px-6 py-3 whitespace-nowrap">
                    <Link
                      href={`https://alfafrens.com/channel/${channel.id}`}
                      target="_blank"
                      className="hover:text-blue-400 underline"
                    >
                      {channelOwners[channel.owner.toLowerCase()]?.length > 15
                        ? `${channelOwners[channel.owner.toLowerCase()].slice(
                            0,
                            10
                          )}...`
                        : channelOwners[channel.owner.toLowerCase()] ||
                          channel.owner.slice(0, 15)}
                    </Link>
                  </td>
                  <td className="px-2 sm:px-6 py-3 whitespace-nowrap font-mono">
                    {Number(
                      parseFloat(
                        Math.floor(
                          ((channel.subscriptionFlowRatePrice *
                            channel.numberOfSubscribers) /
                            FLOW_CONSTANT) *
                            0.7
                        ) *
                          (newStake /
                            (channel.currentStaked / STAKE_CONSTANT + newStake))
                      ).toFixed(2)
                    ).toLocaleString()}
                  </td>
                  <td className="px-2 sm:px-6 py-3 whitespace-nowrap">
                    {parseFloat(
                      (((channel.subscriptionFlowRatePrice / FLOW_CONSTANT) *
                        channel.numberOfSubscribers *
                        0.7) /
                        channel.currentStaked) *
                        100000000000000
                    ).toFixed(2)}
                  </td>
                  <td className="px-2 sm:px-6 py-3 whitespace-nowrap">
                    {channel.numberOfSubscribers.toLocaleString()}
                  </td>
                  <td className="px-2 sm:px-6 py-3 whitespace-nowrap">
                    {parseFloat(channel.currentStaked / STAKE_CONSTANT).toFixed(
                      0
                    )}
                  </td>
                  <td className="px-2 sm:px-6 py-3 whitespace-nowrap">
                    {parseFloat(
                      channel.subscriptionFlowRatePrice / FLOW_CONSTANT
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
        Total Qualifying Channels: {sortedChannels.length}
      </div>
    </div>
  );
};

export default StakeList;
