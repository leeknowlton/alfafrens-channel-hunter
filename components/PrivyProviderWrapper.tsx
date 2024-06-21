"use client";

import { PrivyProvider } from "@privy-io/react-auth";

const PrivyProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID}
      config={{
        appearance: {
          loginMethods: ["farcaster", "email", "wallet"],
          theme: "dark", // or 'light'
          accentColor: "#676FFF", // Customize this to match your app's theme
          logo: "https://your-logo-url", // URL to your logo
        },
        embeddedWallets: {
          createOnLogin: "users-without-wallets", // Create wallets for users without one
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
};

export default PrivyProviderWrapper;
