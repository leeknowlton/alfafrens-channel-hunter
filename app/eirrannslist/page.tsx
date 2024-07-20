/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState, useCallback } from "react";

interface Channel {
  title: string;
  profileimgurl: string;
  sample1: string;
  sample2: string;
  sample3: string;
  channel: {
    id: string;
  };
  totalSubscriptionOutflowRate: number;
  description: string;
  dateAdded: string;
}

interface PopularChannel {
  channel: Channel;
  count: number;
}

const EirrannsList: React.FC = () => {
  const [channels, setChannels] = useState<PopularChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [currentChannelIndex, setCurrentChannelIndex] = useState<number>(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/getEirrannslist");
        const data = await response.json();

        if (!response.ok) {
          setError(data.error);
        } else {
          const sortedChannels = data.sort(
            (a: PopularChannel, b: PopularChannel) => {
              if (b.count === a.count) {
                return Math.random() - 0.5;
              }
              return b.count - a.count;
            }
          );

          setChannels(sortedChannels.slice(0, 100));
        }
      } catch (error) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!selectedImage) return;

      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        let newImageIndex = currentImageIndex;
        let newChannelIndex = currentChannelIndex;

        if (event.key === "ArrowLeft") {
          newImageIndex--;
          if (newImageIndex < 0) {
            newChannelIndex =
              (currentChannelIndex - 1 + channels.length) % channels.length;
            newImageIndex = 2;
          }
        } else {
          newImageIndex++;
          if (newImageIndex > 2) {
            newChannelIndex = (currentChannelIndex + 1) % channels.length;
            newImageIndex = 0;
          }
        }

        const newChannel = channels[newChannelIndex].channel;
        const newImage = [
          newChannel.sample1,
          newChannel.sample2,
          newChannel.sample3,
        ][newImageIndex];

        setSelectedImage(newImage);
        setCurrentImageIndex(newImageIndex);
        setCurrentChannelIndex(newChannelIndex);
      }
    },
    [selectedImage, currentImageIndex, currentChannelIndex, channels]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  if (loading)
    return <p className="text-center text-blue-500 bg-darkBg">Loading...</p>;
  if (error)
    return <p className="text-center text-red-500 bg-darkBg">Error: {error}</p>;

  const getPrice = (rate: number) => {
    return Math.round(rate / 380517503805.174);
  };

  const backgroundColors = [""];

  const openImage = (channelIndex: number, imageIndex: number) => {
    const channel = channels[channelIndex].channel;
    const image = [channel.sample1, channel.sample2, channel.sample3][
      imageIndex
    ];
    setSelectedImage(image);
    setCurrentChannelIndex(channelIndex);
    setCurrentImageIndex(imageIndex);
  };

  return (
    <div className="mx-auto p-4 py-5 relative bg-darkBg">
      <h1 className="text-5xl font-bold mt-8 mb-2 text-secondary text-center font-mono">
        Eirrann&apos;s List
      </h1>
      <div className="container max-w-6xl mx-auto">
        <p className="text-base italic mb-4 text-center">
          An artist&apos;s labor of love
        </p>
        <div className="text-sm mb-4 bg-primary border border-dashed p-2 bg-opacity-10 border-opacity-50 max-w-2xl mx-auto">
          <div className="uppercase text-xs ">Want to be featured?</div>
          <p>
            If you&apos;re an artist with an active channel, drop a line in{" "}
            <a
              href="https://www.alfafrens.com/channel/0xe64a6015049592b9164b2369eBd2bDC5c0997B65"
              className="underline hover:text-secondary"
            >
              eirrann&apos;s AlfaFrens channel
            </a>{" "}
            about your value proposition, subscriber art rewards, etc. I&apos;ll
            sub back and we&apos;ll go from there.
          </p>
        </div>
      </div>
      <div className="relative z-10">
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {channels.map(({ channel }, channelIndex) => (
            <li
              key={channel.channel.id}
              className={`p-6 rounded-lg shadow-xl transition-all duration-300 transform hover:shadow-2xl border border-gray-600 text-white ${
                backgroundColors[channelIndex % backgroundColors.length]
              } bg-opacity-90 hover:bg-opacity-100`}
            >
              <div className="flex flex-col gap-5 relative">
                <div className="flex items-center">
                  <img
                    src={channel.profileimgurl}
                    alt={channel.title}
                    className="w-16 h-16 rounded-full mr-4 border  object-cover"
                  />
                  <div className="flex-grow overflow-hidden">
                    <p className="text-xl font-semibold truncate">
                      {channel.title}
                    </p>
                    <p className="text-sm text-gray-400">
                      {getPrice(channel.totalSubscriptionOutflowRate)} DEGENx
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {[channel.sample1, channel.sample2, channel.sample3].map(
                    (sample, imageIndex) => (
                      <div
                        key={imageIndex}
                        className="relative aspect-square overflow-hidden rounded-md cursor-pointer"
                        onClick={() => openImage(channelIndex, imageIndex)}
                      >
                        <img
                          src={sample}
                          alt={`Sample ${imageIndex + 1}`}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        />
                      </div>
                    )
                  )}
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-300 line-clamp-3">
                    {channel.description}
                  </p>
                </div>
                <a
                  href={`https://alfafrens.com/channel/${channel.channel?.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 block text-center border border-secondary py-2 rounded-md hover:bg-opacity-50 transition-colors duration-300 hover:bg-secondary"
                >
                  View Channel
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl max-h-4xl">
            <img
              src={selectedImage}
              alt="Enlarged artwork"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EirrannsList;
