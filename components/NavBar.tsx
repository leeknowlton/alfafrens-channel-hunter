"use client";

import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";

const NavBar: React.FC = () => {
  const { login, logout, user } = usePrivy();

  return (
    <nav className="bg-darkBg text-white py-4 px-4 border-b border-base-200">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <div className="flex flex-col">
            <div>
              <span className="font-bold">Alfa</span>Frens
            </div>
            <span className="font-mono text-secondary">CHANNEL HUNTER</span>
          </div>
        </Link>
        <div className="space-x-6 hidden md:flex items-center">
          <Link href="/vennfrens">
            <span className="hover:text-gray-200">Venn Frens</span>
          </Link>
          <span className="border-r border-secondary h-6"></span>
          <Link href="/popularitycontest">
            <span className="hover:text-gray-200">Popularity Contest</span>
          </Link>
          <span className="border-r border-secondary h-6"></span>
          <Link href="/zenislist">
            <span className="hover:text-gray-200">Zeni&apos;s List</span>
          </Link>
          <span className="border-r border-secondary h-6"></span>
          <Link href="/bigstakes">
            <span className="hover:text-gray-200">Big Stakes</span>
          </Link>
          <span className="border-r border-secondary h-6"></span>
          {!user ? (
            <button
              onClick={() => login()}
              className="bg-primary bg-opacity-10 border border-primary py-1 px-4 rounded"
            >
              Login
            </button>
          ) : (
            <button
              onClick={() => logout()}
              className="border border-secondary py-1 px-4 rounded"
            >
              Log Out
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
