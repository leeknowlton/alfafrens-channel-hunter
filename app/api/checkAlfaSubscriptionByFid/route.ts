// app/api/checkAlfaSubscriptionByFid/route.ts

import { NextRequest, NextResponse } from "next/server";

const ALFAFRENS_CHANNEL_ID = "0x9d9141d98ea1b553a8d761c23c221603bd58a58b";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const fid = searchParams.get("fid");

  if (!fid) {
    return NextResponse.json(
      { error: "Farcaster ID (fid) is required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://alfafrens.com/api/v0/isUserByFidSubscribedToChannel?channelAddress=${ALFAFRENS_CHANNEL_ID}&fid=${fid}`
    );

    if (!response.ok) {
      throw new Error("Failed to check subscription");
    }

    const isSubscribed = await response.json();
    return NextResponse.json({ isSubscribed });
  } catch (error) {
    console.error("Error checking subscription:", error);
    return NextResponse.json(
      { error: "Failed to check subscription" },
      { status: 500 }
    );
  }
}
