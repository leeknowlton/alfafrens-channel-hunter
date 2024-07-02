import Link from "next/link";

const NavBar: React.FC = () => {
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
        <div className="space-x-6 hidden md:flex">
          <Link href="/vennfrens">
            <span className="hover:text-gray-200">Venn Frens</span>
          </Link>
          <span className="border-r border-secondary"></span>
          <Link href="/popularitycontest">
            <span className="hover:text-gray-200">Popularity Contest</span>
          </Link>
          <span className="border-r border-secondary"></span>
          <Link href="/zenislist">
            <span className="hover:text-gray-200">Zeni&apos;s List</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
