/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";

interface Channel {
  title: string;
  profileimgurl: string;
  channel: {
    id: string;
  };
  totalSubscriptionOutflowRate: number;
}

interface ChannelItemProps {
  channel: Channel;
}

const ChannelItem: React.FC<ChannelItemProps> = ({ channel }) => {
  return (
    <a
      href={`https://alfafrens.com/channel/${channel.channel?.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-50 flex items-center py-2 hover:bg-gray-800 rounded-md px-2"
    >
      <img
        src={channel.profileimgurl}
        alt={channel.title}
        className="w-8 h-8 rounded-full mr-4"
      />
      <div className="flex flex-col">
        <p className="text-sm">{channel.title}</p>
        <span className="text-xs text-gray-500">
          {Math.round(channel.totalSubscriptionOutflowRate / 380517503805.174)}
        </span>
      </div>
    </a>
  );
};

export default ChannelItem;
