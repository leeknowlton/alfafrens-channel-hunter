"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";
import { Menu, X } from "lucide-react";

const NavBar: React.FC = () => {
  const { login, logout, user } = usePrivy();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const NavLink: React.FC<{ href: string; children: React.ReactNode }> = ({
    href,
    children,
  }) => (
    <Link href={href}>
      <span className="block py-2 hover:text-blue-400">{children}</span>
    </Link>
  );

  return (
    <nav className="bg-darkBg text-white py-4 px-4 border-b border-base-200 relative">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <div className="flex flex-col">
            <div>
              <span className="font-bold">Alfa</span>Frens
            </div>
            <span className="font-mono text-secondary">CHANNEL HUNTER</span>
          </div>
        </Link>
        <div className="md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        <div
          className={`md:flex md:items-center md:space-x-4 ${
            isMenuOpen ? "block" : "hidden"
          } absolute md:static left-0 right-0 top-full bg-darkBg md:bg-transparent z-50`}
        >
          <div className="flex flex-col md:flex-row md:items-center px-4 md:px-0 py-2 md:py-0 space-y-2 md:space-y-0 md:space-x-4">
            <NavLink href="/vennfrens">Venn Frens</NavLink>
            <NavLink href="/popularitycontest">Popularity Contest</NavLink>
            <NavLink href="/bigstakes">Big Stakes</NavLink>
            <NavLink href="/zenislist">Zeni&apos;s List</NavLink>
            <NavLink href="/eirrannslist">Eirrann&apos;s List</NavLink>
            {!user ? (
              <button
                onClick={() => login()}
                className="bg-primary bg-opacity-10 border border-primary py-1 px-4 rounded w-full md:w-auto text-left md:text-center"
              >
                Login
              </button>
            ) : (
              <button
                onClick={() => logout()}
                className="border border-secondary py-1 px-4 rounded w-full md:w-auto text-left md:text-center"
              >
                Log Out
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
