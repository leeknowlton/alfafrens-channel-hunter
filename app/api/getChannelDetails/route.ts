import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const channelAddress = searchParams.get("channelAddress");

  if (!channelAddress) {
    return NextResponse.json(
      { error: "Channel address is required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://alfafrens.com/api/v0/getChannel?channelAddress=${channelAddress}`
    );
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching channel details:", error);
    return NextResponse.json(
      { error: "Failed to fetch channel details" },
      { status: 500 }
    );
  }
}
