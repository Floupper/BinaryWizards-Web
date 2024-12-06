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

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="relative w-full flex justify-between items-center p-5 text-black ">
      <div className="text-[3.09rem] font-bold font-mogula">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "text-black" : "")}
        >
          Quiz
        </NavLink>
      </div>
      <button
        className="md:hidden text-2xl bg-black text-white p-2 w-14 rounded focus:outline-none focus:ring-0 hover:bg-black hover:text-white"
        onClick={toggleMenu}
      >
        ☰
      </button>
      <ul
        className={`md:flex md:items-center md:gap-5 list-none ${isOpen
          ? "flex flex-col items-center justify-center absolute top-full left-0 w-full p-5 bg-white"
          : "hidden md:flex"
          }`}
      >

        <li className="flex items-center">
          <NavLink
            to="/"
            className={
              (({ isActive }) => (isActive ? "text-black" : "text-black"),
                "flex items-center")
            }
            style={{ fontFamily: "Helvetica", fontSize: "1.401rem" }}
          >
            <EmojiProvider data={emojiData}>
              <Emoji name="waving-hand" width={20} />
            </EmojiProvider>
            Play
          </NavLink>
        </li>
        <li className="flex items-center">
          <a
            href="https://expo.dev/artifacts/eas/5gEMQTEd1ZfvhicxFnmkjT.apk"
            download
            className="flex items-center text-black"
            style={{ fontFamily: "Helvetica", fontSize: "1.401rem" }}
          >
            <EmojiProvider data={emojiData}>
              <Emoji name="mobile-phone-with-arrow" width={20} />
            </EmojiProvider>
            Download
          </a>
        </li>
        <li className="flex items-center">
          <NavLink
            to="/create-quiz"
            className={
              (({ isActive }) => (isActive ? "text-black" : "text-black"),
                "flex items-center")
            }
            style={{ fontFamily: "Helvetica", fontSize: "1.401rem" }}
          >
            <EmojiProvider data={emojiData}>
              <Emoji name="paintbrush" width={20} />
            </EmojiProvider>
            Create Quiz
          </NavLink>
        </li>


        {token ? (
          <>
            <li className="flex items-center">
              <EmojiProvider data={emojiData}>
                <Emoji name="paintbrush" width={20} />
              </EmojiProvider>
              <NavLink
                to="/quick-quiz"
                className={({ isActive }) =>
                  isActive ? "text-black" : "text-black"
                }
                style={{ fontFamily: "Helvetica", fontSize: "1.401rem" }}
              >
                Create quick Quiz
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive ? "text-black" : "text-black"
                }
                style={{ fontFamily: "Helvetica", fontSize: "1.401rem" }}
              >
                Dashboard
              </NavLink>
            </li>
            <li>
              <button
                onClick={handleSignout}
                className="bg-black text-white p-2 rounded hover:bg-black hover:text-white focus:outline-none focus:ring-0"
                style={{
                  fontFamily: "Helvetica",
                  fontSize: "1.401rem",
                  borderRadius: "1.778rem",
                }}
              >
                Sign out
              </button>
            </li>
          </>
        ) : (
          <li>
            <NavLink
              to="/signin"
              className={({ isActive }) =>
                isActive
                  ? "bg-black text-white p-2 rounded hover:bg-black hover:text-white focus:outline-none focus:ring-0"
                  : "bg-black text-white p-2 rounded hover:bg-black hover:text-white focus:outline-none focus:ring-0"
              }
              style={{
                fontFamily: "Helvetica",
                fontSize: "1.401rem",
                borderRadius: "1.778rem",
              }}
            >
              Sign in
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
}
