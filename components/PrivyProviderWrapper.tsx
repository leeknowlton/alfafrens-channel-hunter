"use client";

import { PrivyProvider } from "@privy-io/react-auth";

const PrivyProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
      config={{
        appearance: {
          theme: "dark", // or 'light'
          accentColor: "#676FFF", // Customize this to match your app's theme
          logo: "https://afchannelhunter.zenigame.net/_next/image?url=%2Fpopularity.png&w=384&q=75", // URL to your logo
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
};

export default PrivyProviderWrapper;
