import React from "react";
import LogoSvg from "../assets/LogoSvg";
import Button from "./Button";

const Header = () => {
  return (
    <header className="flex w-full items-center justify-between bg-white p-4">
      <div>
        <a href="/">
          <LogoSvg />
        </a>
      </div>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <a href="/features" className="text-gray-600 hover:text-gray-900">
              Features
            </a>
          </li>
          <li>
            <a href="/pricing" className="text-gray-600 hover:text-gray-900">
              Pricing
            </a>
          </li>
          <li>
            <a href="/about" className="text-gray-600 hover:text-gray-900">
              About
            </a>
          </li>
          {/* Add more links as needed */}
        </ul>
      </nav>
      <div className="flex space-x-4">
        <Button variant="secondary">Log in</Button>
        <Button variant="secondary">Sign up</Button>
        <button className="rounded bg-blue-500 px-4 py-2 text-white">Sign up</button>
      </div>
    </header>
  );
};

export default Header;
