// app/api/getUserByFid/route.ts
import { NextResponse } from "next/server";

interface UserResponse {
  handle: string;
  fid: string;
  userAddress: string;
  channeladdress: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fid = searchParams.get("fid");

  if (!fid) {
    return NextResponse.json(
      { error: "Missing required query parameter: fid" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://alfafrens.com/api/v0/getUserByFid?fid=${fid}`,
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

    const data: UserResponse = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
