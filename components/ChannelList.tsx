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
  channels: Channel[];
  title: string;
}

const ChannelList: React.FC<ChannelListProps> = ({ channels }) => {
  return (
    <ul className="list-inside p-4 bg-base-200">
      {channels.map((channel, index) => (
        <ChannelItem key={index} channel={channel} />
      ))}
    </ul>
  );
};

export default ChannelList;
