"use client";

import React from "react";
import { usePrivy } from "@privy-io/react-auth";

const ExampleComponent: React.FC = () => {
  const { login, logout, user } = usePrivy();

  return (
    <div>
      {!user ? (
        <button onClick={() => login()}>Sign in with Privy</button>
      ) : (
        <>
          <p>Welcome, {user.email || user.farcaster?.displayName}!</p>
          <button onClick={() => logout()}>Log Out</button>
        </>
      )}
    </div>
  );
};

export default ExampleComponent;
