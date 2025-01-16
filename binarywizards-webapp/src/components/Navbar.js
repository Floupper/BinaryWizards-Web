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
      <div className="text-[2.5rem] font-semibold font-mogula md:text-[3.3rem]">
        <NavLink to="/" className="text-black">
          Mogula
        </NavLink>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="lg:hidden z-20 text-3xl bg-black text-white p-2 w-14 rounded focus:outline-none hover:bg-black hover:text-white"
        onClick={toggleMenu}
      >
        ☰
      </button>

      {/* Navigation Links */}
      <ul
        className={`lg:flex lg:items-center lg:gap-5 list-none transition-all duration-300 ease-in-out ${
          isOpen
          ? "z-10 flex flex-col absolute top-0 right-[-1rem] h-[100vh] pt-[8rem] gap-y-5 p-8 bg-white shadow-lg rounded-3xl transform lg:static lg:p-0 md:shadow-none transition-all duration-500 ease-out"
          : "hidden lg:flex"
        }`}
      >
        {/* Download */}
        <li className="flex items-center mr-5">
          <a
            href="https://expo.dev/artifacts/eas/5gEMQTEd1ZfvhicxFnmkjT.apk"
            download
            className="flex items-center text-black hover:scale-110"
            style={{ fontFamily: "Helvetica", fontSize: "1.401rem" }}
          >
            <EmojiProvider data={emojiData}>
              <Emoji name="mobile-phone-with-arrow" width={20} />
            </EmojiProvider>
            <span className="ml-2">Download</span>
          </a>
        </li>
        {/* Play */}
        <li className="flex items-center mr-5">
          <NavLink
            to="/"
            className="flex items-center text-black hover:scale-110"
            style={{ fontFamily: "Helvetica", fontSize: "1.401rem" }}
          >
            <EmojiProvider data={emojiData}>
              <Emoji name="waving-hand" width={20} />
            </EmojiProvider>
            <span className="ml-2">Play</span>
          </NavLink>
        </li>

        {/* Create Quiz */}
        <li className="flex items-center mr-5">
          <NavLink
            to="/create-quiz"
            className="flex items-center text-black hover:scale-110"
            style={{ fontFamily: "Helvetica", fontSize: "1.401rem" }}
          >
              {token ? (
                <>
                  <EmojiProvider data={emojiData}>
                    <Emoji name="paintbrush" width={20} />
                  </EmojiProvider>
                  <span className="ml-2">Create Quiz</span>
                </>
              ) : (
                <>
                  <EmojiProvider data={emojiData}>
                    <Emoji name="bomb" width={20} />
                  </EmojiProvider>
                  <span className="ml-2">Quick Quiz</span>
                </>
              )}
          </NavLink>
        </li>
        {token ? (
          <>
          {/* Profile */}
            <div className="flex flex-col lg:flex-row gap-y-4">
              {/* Create Quick Quiz */}
              <li className="flex items-center mr-5">
                <NavLink
                  to="/quick-quiz"
                  className="flex items-center text-black hover:scale-110"
                  style={{ fontFamily: "Helvetica", fontSize: "1.401rem" }}
                >
                  <EmojiProvider data={emojiData}>
                    <Emoji name="bomb" width={20} />
                  </EmojiProvider>
                  <span className="ml-2">Quick Quiz</span>
                </NavLink>
              </li>

              {/* Dashboard */}
              <li className="flex items-center mr-5">
                <NavLink
                  to="/dashboard"
                  className="flex items-center text-black hover:scale-110"
                  style={{ fontFamily: "Helvetica", fontSize: "1.401rem" }}
                >
                  <EmojiProvider data={emojiData}>
                    <Emoji name="bust-in-silhouette" width={20} />
                  </EmojiProvider>
                  <span className="ml-2">Dashboard</span>
                </NavLink>
              </li>

              {/* Sign Out */}
              <li className="flex items-center lg:mr-5 mb-3 md:mb-0">
                <button
                  onClick={handleSignout}
                  className="border-2 border-black text-black rounded w-36 h-16 hover:bg-black hover:text-white focus:outline-none"
                  style={{
                    fontFamily: "Helvetica",
                    fontSize: "1.2rem",
                    borderRadius: "1.778rem",
                  }}
                >
                  Sign Out
                </button>
              </li>
            </div>
          </>
        ) : (
          /* Sign In */
          <li className="flex items-center mb-3 md:mb-0">
            <button
              onClick={handleSignin}
              className="border-2 border-black text-black rounded w-36 h-16 hover:bg-black hover:text-white focus:outline-none"
              style={{
                fontFamily: "Helvetica",
                fontSize: "1.2rem",
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