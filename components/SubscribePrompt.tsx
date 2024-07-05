"use client";

import { usePrivy } from "@privy-io/react-auth";

const SubscribePrompt: React.FC = () => {
  const { user } = usePrivy();

  return (
    <div className="flex flex-col items-center justify-center bg-gray-800 bg-opacity-80 p-4 rounded-md shadow-md">
      <h2 className="text-lg font-bold text-secondary mb-2">
        Unlock The Big Stakes Calculator
      </h2>
      <p className="text-sm text-gray-300 mb-4">Subscribe to Zenigame.</p>
      {user ? (
        <a
          href="https://alfafrens.com/channel/0x9d9141d98ea1b553a8d761c23c221603bd58a58b" // Replace with your actual channel link
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
        >
          Subscribe
        </a>
      ) : (
        <p className="text-sm text-gray-400">Please log in.</p>
      )}
    </div>
  );
};

export default SubscribePrompt;
