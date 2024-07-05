import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const channelAddress = searchParams.get("channelAddress");
  const userAddress = searchParams.get("userAddress");

  if (!channelAddress || !userAddress) {
    return NextResponse.json(
      { error: "Missing required query parameters" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://alfafrens.com/api/v0/isUserSubscribedToChannel?channelAddress=${channelAddress}&userAddress=${userAddress}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch subscription status" },
        { status: response.status }
      );
    }

    const isSubscribed = await response.json();
    return NextResponse.json(isSubscribed, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
