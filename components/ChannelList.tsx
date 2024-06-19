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
      <ul className="list-inside rounded-lg p-4">
        {channels.map((channel, index) => (
          <ChannelItem key={index} channel={channel} />
        ))}
      </ul>
    </div>
  );
};

export default ChannelList;
