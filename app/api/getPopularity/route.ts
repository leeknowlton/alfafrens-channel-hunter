// app/api/getPopularity/route.ts
import { NextResponse } from "next/server";
import { join } from "path";
import { readFile } from "fs/promises";

export async function GET() {
  try {
    const filePath = join(process.cwd(), "public", "popularityData.json");
    const data = await readFile(filePath, "utf-8");
    const channels = JSON.parse(data);

    return NextResponse.json(channels);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
