import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { EmojiProvider, Emoji } from "react-apple-emojis";
import emojiData from "react-apple-emojis/src/data.json";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleSignout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleSignin = () => {
    navigate("/signin");
  };

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <nav className="relative w-full flex justify-between items-center p-5 text-black">
      {/* Logo */}
      <div className="text-[3.3rem] font-semibold font-mogula">
        <NavLink to="/" className="text-black">
          Mogula
        </NavLink>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-2xl bg-black text-white p-2 w-14 rounded focus:outline-none hover:bg-black hover:text-white"
        onClick={toggleMenu}
      >
        ☰
      </button>

      {/* Navigation Links */}
      <ul
        className={`md:flex md:items-center md:gap-5 list-none ${isOpen
          ? "flex flex-col items-center absolute top-full left-0 w-full p-5 bg-white"
          : "hidden md:flex"
          }`}
      >
        {/* Play */}
        <li className="flex items-center mr-5">
          <NavLink
            to="/"
            className="flex items-center text-black"
            style={{ fontFamily: "Helvetica", fontSize: "1.401rem" }}
          >
            <EmojiProvider data={emojiData}>
              <Emoji name="waving-hand" width={20} />
            </EmojiProvider>
            <span className="ml-2">Play</span>
          </NavLink>
        </li>

        {/* Download */}
        <li className="flex items-center mr-5">
          <a
            href="https://expo.dev/artifacts/eas/5gEMQTEd1ZfvhicxFnmkjT.apk"
            download
            className="flex items-center text-black"
            style={{ fontFamily: "Helvetica", fontSize: "1.401rem" }}
          >
            <EmojiProvider data={emojiData}>
              <Emoji name="mobile-phone-with-arrow" width={20} />
            </EmojiProvider>
            <span className="ml-2">Download</span>
          </a>
        </li>

        {/* Create Quiz */}
        <li className="flex items-center mr-5">
          <NavLink
            to="/create-quiz"
            className="flex items-center text-black"
            style={{ fontFamily: "Helvetica", fontSize: "1.401rem" }}
          >
            <EmojiProvider data={emojiData}>
              <Emoji name="paintbrush" width={20} />
            </EmojiProvider>
            <span className="ml-2">Create Quiz</span>
          </NavLink>
        </li>

        {token ? (
          <>
            {/* Create Quick Quiz */}
            <li className="flex items-center mr-5">
              <NavLink
                to="/quick-quiz"
                className="flex items-center text-black"
                style={{ fontFamily: "Helvetica", fontSize: "1.401rem" }}
              >
                <EmojiProvider data={emojiData}>
                  <Emoji name="paintbrush" width={20} />
                </EmojiProvider>
                <span className="ml-2">Create Quick Quiz</span>
              </NavLink>
            </li>

            {/* Dashboard */}
            <li className="flex items-center mr-5">
              <NavLink
                to="/dashboard"
                className="text-black"
                style={{ fontFamily: "Helvetica", fontSize: "1.401rem" }}
              >
                Dashboard
              </NavLink>
            </li>

            {/* Sign Out */}
            <li className="flex items-center mr-5">
              <button
                onClick={handleSignout}
                className=" border-2 border-black text-black rounded w-36 h-16 hover:bg-black hover:text-white focus:outline-none"
                style={{
                  fontFamily: "Helvetica",
                  fontSize: "1.401rem",
                  borderRadius: "1.778rem",
                }}
              >
                Sign Out
              </button>
            </li>
          </>
        ) : (
          /* Sign In */
          <li className="flex items-center">
            <button
              onClick={handleSignin}
              className="border-2 border-black text-black rounded w-36 h-16 hover:bg-black hover:text-white focus:outline-none"
              style={{
                fontFamily: "Helvetica",
                fontSize: "1.401rem",
                borderRadius: "1.778rem",
              }}
            >
              Sign In
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}