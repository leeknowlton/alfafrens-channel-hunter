// app/api/getUserSubscribedChannels/route.ts
import { NextResponse } from "next/server";

interface Channel {
  title: string;
  profileimgurl: string;
  // Add other fields as necessary
}

interface ApiResponse {
  channels: Channel[];
  hasMore: boolean;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fid = searchParams.get("fid");
  const first = searchParams.get("first");
  const skip = searchParams.get("skip");

  if (!fid || !first || !skip) {
    return NextResponse.json(
      { error: "Missing required query parameters: fid, first, skip" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://alfafrens.com/api/v0/getUserSubscribedChannels?fid=${fid}&first=${first}&skip=${skip}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch data" },
        { status: response.status }
      );
    }

    const data: ApiResponse = await response.json();
    console.log(data);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
