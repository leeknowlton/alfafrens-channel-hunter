import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");

    if (!q || typeof q !== "string") {
      return NextResponse.json(
        { error: "Query parameter q is required" },
        { status: 400 }
      );
    }

    const response = await axios.get(
      `https://api.neynar.com/v2/farcaster/user/search?q=${q}&viewer_fid=3&limit=5`,
      {
        headers: {
          accept: "application/json",
          api_key: process.env.NEYNAR_API_KEY,
        },
      }
    );

    return NextResponse.json(response.data.result.users, { status: 200 });
  } catch (error) {
    console.error("Error fetching search results:", error);
    if (axios.isAxiosError(error)) {
      console.error("Axios error details:", error.response?.data);
    }
    return NextResponse.json(
      { error: "Failed to fetch search results" },
      { status: 500 }
    );
  }
}
