// app/api/getChannelOwners/route.ts
import { NextResponse } from "next/server";

const channelAddresses = [
  // List of channel addresses
  "0x4570b25f9ecee686a4a7b9c2953bb57ae834b703",
  "0x6bb194b440e485d1cff40f7d4194bcbd97411efd",
  "0x6916c98552262c8ccf782b2b03229a3df3cc3079",
  "0x4e21d82d50bfb38d515b926609d1b1a52ffeaa0f",
  "0xdba348c9f8dcac041864cd6ed818b1c0490a32c6",
  "0x94a350ea9f994aa5e1009bbfccfd59cd2bb6fbfe",
  "0xa93f92b5f3da7a6e116b0d5cfa58e25b1e330537",
  "0xbba4fb6f3e0b187b20f4e6a8d4531a4f392a1201",
  "0x25b4e594b97e005f4523616560a472901713bfc3",
  "0x469f867c49c5cd2d61970d627a843fbdfccb83ac",
  "0x7687ea40992cf4814289b24e1fc33c9843d0d92d",
  "0xfdd37755af7376f4ec0483e89dc8b7eea09630a0",
  "0x5d8e50845bbca2e0f5af87b2bb5daf26a5637fa6",
  "0x500b64094664756c22e7cef18d1fa56b1673a461",
  "0x1308e16eb155c405577366eb1c94cf8c00019b35",
  "0x3e01900e2785eddf48750b48d54cb91bc52353ab",
  "0x23ad0d15124f20e9b7ae15177a99842b581a653d",
  "0x76b9c65dbbfb612fa5acbb4cd9e9593f84ece957",
  "0x3ac263b2b6546fbf2a7b9616e6aa8f0608c6771c",
  "0xe316fc194a2bf5774c915484a3400a08eb8743f6",
  "0x35dfccae83f23a7f91c0e4ff27d323fc161baca7",
  "0x59bc0368659a6b9ed7031202bd2b54ba099aefc7",
  "0xfb9f731c22821b5fee3287df4b86988f0687e3b2",
  "0xfc9cf3c67c2aaa891f4d727fa26f945a6d63ad65",
  "0x39ca1e38b79b487926d46aeb22cdc9110ba8707f",
  "0x1681936238a65fca1b40844837383219db1907e8",
  "0x6df5f4fabbf57c9088d216a72cf4bc06972f6876",
  "0x04e0bca602b22ad25e91301b68e5aa426486343d",
  "0x716ef153fd76550a6733f04a54608208e66d3cac",
  "0x887f8f1b6d4f1430e6de391cf884e527b13e40ec",
  "0x05c2b2d8d673fe6a358a5e94e7ef2047a5db1e86",
  "0x2f177225f8924db2a6017ed9bb2a47b908c8414a",
  "0xd98d74d5ee13e3d3ff85fa9561250897092750a3",
  "0x9d9141d98ea1b553a8d761c23c221603bd58a58b",
  "0x0feabb38be8891fa11e24a22208d690e8827541d",
  "0xbe16e43c86a4094bf1be0e51bd693871065229bc",
  "0x64cc080cd808bae97d781ce2ef3f1c8f49502be5",
  "0xd254be01a509092c438afc93ef140fcec8cfb523",
  "0xaf9b07a0c9adcf882c3263493becb93da57f2d79",
  "0xce64705563d0e6247e06d171f858115689eb6e66",
  "0x28e3168bd9f7599d930d610991a4f89e3799977e",
  "0x8dc7f8c6e66708d8fb608bf02992daaefed5232a",
  "0x4a2459f21e7752e3dfa61c70ad9aabb194b53ae1",
  "0x0ea5c1755a38b5bd28826cca5afc88d530551eeb",
  "0xe893047d0232ca9e1b8d6655e7343d3b04ce095f",
  "0x33146a743f42945ce900acae9683d860906bc84f",
  "0x1f1d78079ac00ce1486ff463ae52dc3e7a4cdcc9",
  "0xd2314cbdc4310a1d0df5ec5eec0ce505238afa18",
  "0x57f90b5850740bdd2dc8dd0f9b1c8bc8fe880dff",
  "0x119cb2f4d43fb219ab7bc18789e4c1c0264e75e8",
];

async function fetchChannelOwners(channelAddresses: string[]) {
  const response = await fetch(
    `https://alfafrens.com/api/v0/getChannelsOwners?channelAddresses=${channelAddresses.join(
      ","
    )}`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch channel owners");
  }

  const result = await response.json();
  return result;
}

async function fetchUserByAddress(userAddress: string) {
  const response = await fetch(
    `https://alfafrens.com/api/v0/getUserByAddress?userAddress=${userAddress}`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch user data by address");
  }

  const result = await response.json();
  return result;
}

export async function GET() {
  try {
    const ownersMap: { [key: string]: number } = {};
    const userAddresses: string[] = [];

    const channelOwners = await fetchChannelOwners(channelAddresses);

    for (const channel of channelOwners) {
      if (channel.users?.aa_address) {
        userAddresses.push(channel.users.aa_address);
      }
    }

    const fetchFidPromises = userAddresses.map((address) =>
      fetchUserByAddress(address)
    );
    const usersData = await Promise.all(fetchFidPromises);

    usersData.forEach((user) => {
      const fid = user.fid;
      ownersMap[fid] = (ownersMap[fid] || 0) + 1;
    });

    const sortedOwners = Object.entries(ownersMap).sort((a, b) => b[1] - a[1]);

    return NextResponse.json(sortedOwners);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
