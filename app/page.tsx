"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-darkBg text-white font-sans">
      <div className="mx-auto p-4">
        <h2 className="text-2xl text-center glitch font-orbitron">
          Alfa<span className="font-bold">Frens</span>
        </h2>
        <h1 className="text-4xl font-bold mb-8 text-center glitch font-orbitron text-secondary uppercase">
          Channel Hunt
        </h1>
        <div className="flex gap-8 mx-auto">
          <Link
            href="/vennfrens"
            className="bg-primary p-10 rounded-lg shadow-lg transform hover:scale-105 transition-transform border border-white border-dashed bg-opacity-50 min-w-96"
          >
            <h2 className="text-2xl font-bold text-secondary mb-2 text-center">
              VENN FRENS
            </h2>
            <div className="flex justify-center my-4">
              <Image
                src="/venn.png"
                alt="Venn Frens"
                width={197}
                height={110}
                className="mx-auto"
              />
            </div>
            <div className="w-64 mx-auto mt-8">
              <p className="text-sm">
                Two users, compare
                <br />
                Subs they share and those apart —<br />
                Differences revealed.
                <br />- Matsuo Basho
              </p>
              <p className="mt-4 text-xs italic">
                (This actually might be useful!)
              </p>
            </div>
          </Link>
          <Link
            href="/popularitycontest"
            className="bg-secondary p-10 rounded-lg shadow-lg transform hover:scale-105 transition-transform border border-white border-dashed bg-opacity-80 min-w-96 text-gray-900"
          >
            <h2 className="text-2xl font-bold text-primary mb-2 text-center">
              POPULARITY CONTEST
            </h2>
            <div className="flex justify-center my-4">
              <Image
                src="/popularity.png" // Replace with actual path to your Popularity Contest image
                alt="Popularity Contest"
                width={150}
                height={150}
                className="mx-auto"
              />
            </div>
            <div className="w-64 mx-auto">
              <p className="text-sm italic mb-4">
                Less fair than your high school homecoming.
              </p>
              <p className="text-sm">
                We took subs from the Top 100 (by stake) and ranked by how many
                times they appeared.
                <br />
              </p>
              <p className="text-xs mt-2 italic">
                (Updated periodically at best)
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
