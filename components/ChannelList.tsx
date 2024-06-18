"use client";

import React from "react";
import ChannelItem from "./ChannelItem";

interface Channel {
  title: string;
  profileimgurl: string;
  channel: {
    id: string;
  };
  totalSubscriptionOutflowRate: number;
}

interface ChannelListProps {
  title: string;
  channels: Channel[];
}

const ChannelList: React.FC<ChannelListProps> = ({ title, channels }) => {
  return (
    <div>
      <h2 className="text-lg font-bold text-center mb-4">{title}</h2>
      <ul className="list-inside rounded-lg p-4 bg-base-200 shadow-md">
        {channels.map((channel, index) => (
          <ChannelItem key={index} channel={channel} />
        ))}
      </ul>
    </div>
  );
};

export default ChannelList;
