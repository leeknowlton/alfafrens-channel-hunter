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
      className="text-blue-50 flex py-2 hover:bg-gray-800 rounded-md px-2"
    >
      <li className="flex items-center ">
        <img
          src={channel.profileimgurl}
          alt={channel.title}
          className="w-10 h-10 rounded-full mr-4"
        />
        <div className="flex flex-col">
          {channel.title}
          <span className="text-xs text-gray-500">
            {Math.round(
              channel.totalSubscriptionOutflowRate / 380517503805.174
            )}
          </span>
        </div>
      </li>
    </a>
  );
};

export default ChannelItem;
