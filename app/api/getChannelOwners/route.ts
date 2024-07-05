import { NextResponse } from "next/server";

interface OwnerResponse {
  channelAddress: string;
  users: { id: string; handle: string }[];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const channelAddressesParam = searchParams.get("channelAddresses");

  if (!channelAddressesParam) {
    return NextResponse.json(
      { error: "Missing required query parameter: channelAddresses" },
      { status: 400 }
    );
  }

  const channelAddresses = channelAddressesParam.split(",");
  let allOwners: { id: string; handle: string }[] = [];
  let batchStart = 0;
  const batchSize = 20;

  while (batchStart < channelAddresses.length) {
    const batchAddresses = channelAddresses.slice(
      batchStart,
      batchStart + batchSize
    );
    const response = await fetch(
      `https://alfafrens.com/api/v0/getChannelsOwners?channelAddresses=${batchAddresses.join(
        ","
      )}`
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch data" },
        { status: response.status }
      );
    }

    const data: OwnerResponse[] = await response.json();
    allOwners = allOwners.concat(data.flatMap((owner) => owner.users));
    batchStart += batchSize;
  }
  return NextResponse.json({ owners: allOwners }, { status: 200 });
}
