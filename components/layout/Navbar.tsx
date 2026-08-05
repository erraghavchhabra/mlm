"use client";

import { User, Settings, LogOut, Bell, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

export default function Navbar({
  setSidebarOpen,
}: {
  setSidebarOpen: (value: boolean) => void;
}) {
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          const userObj = JSON.parse(stored);
          if (userObj.full_name || userObj.name) {
            setUserName(userObj.full_name || userObj.name);
          }
        } catch (e) {
          // fallback
        }
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/login");
    }
  };

  return (
    <header
      className="
 relative
 z-20
 mb-4
 flex
 h-16
 items-center
 justify-between
        rounded-[24px]
        border border-white/10
        bg-[linear-gradient(156deg,#27032e_0%,#070735_45%,#4742ca_100%)]
        px-4 sm:px-5 lg:px-6
        shadow-[0_20px_50px_rgba(0,0,0,.4)]
        backdrop-blur-xl
      "
    >
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[28px]">
        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#7B61FF]/20 blur-[90px]" />
        <div className="absolute -left-20 -bottom-20 h-56 w-56 rounded-full bg-[#5A4DFF]/15 blur-[100px]" />
      </div>

      {/* Left */}
      <div className="relative z-10 flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="
            flex h-9 w-9 items-center justify-center
            rounded-xl
            border border-white/10
            bg-white/5
            text-white
            backdrop-blur-lg
            transition
            hover:bg-white/10
            lg:hidden
          "
        >
          <Menu size={19} />
        </button>

        <h1 className="text-lg font-semibold tracking-wide text-white sm:text-xl">
          Dashboard
        </h1>
      </div>

      {/* Right */}
      <div className="relative z-20 flex items-center gap-2">
        {/* Notification */}
        <button
          className="
            relative flex h-9 w-9 items-center justify-center
            rounded-xl
            border border-white/10
            bg-white/5
            text-white
            backdrop-blur-lg
            transition
            hover:bg-white/10
          "
        >
          <Bell size={17} />

          <span
            className="
              absolute right-1.5 top-1.5
              h-2 w-2
              rounded-full
              bg-red-500
            "
          />
        </button>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="
              rounded-xl
              border border-white/10
              bg-white/5
              p-1
              backdrop-blur-lg
              transition
              hover:bg-white/10
            "
          >
            <div
              className="
                relative h-9 w-9 rounded-full
                bg-gradient-to-br
                from-violet-500
                via-indigo-500
                to-blue-500
                p-[2px]
              "
            >
              <img
                src="/assets/img/profile.jpg"
                alt="Profile"
                className="
                  h-full
                  w-full
                  rounded-full
                  border-2 border-[#24195d]
                  object-cover
                "
              />

              <span
                className="
                  absolute bottom-0 right-0
                  h-3 w-3
                  rounded-full
                  border-2 border-[#24195d]
                  bg-emerald-400
                "
              />
            </div>
          </button>

          {/* Dropdown */}
          {profileOpen && (
            <div
              className="
                absolute
                right-0
                top-full
                mt-3
                z-[999]
                w-[260px]
                overflow-hidden
                rounded-[24px]
                border border-white/10
                bg-[linear-gradient(156deg,#27032e_0%,#070735_45%,#4742ca_100%)]
                shadow-[0_25px_60px_rgba(0,0,0,.5)]
                backdrop-blur-xl
              "
            >
              <div>
                {/* User Header */}
                <div
                  className="
                    flex items-center gap-3
                    border-b border-white/10
                    px-4 py-4
                  "
                >
                  <img
                    src="/assets/img/profile.jpg"
                    className="
                      h-10 w-10
                      rounded-full
                      border-2 border-[#24195d]
                      object-cover
                    "
                  />

                  <div>
                    <p className="text-sm font-semibold text-white">
                      {userName}
                    </p>

                    <p className="text-xs text-slate-300">User</p>
                  </div>
                </div>

                {/* Profile Link */}
                <Link
                  href="/user/profile"
                  onClick={() => setProfileOpen(false)}
                  className="
                    flex w-full items-center gap-3
                    px-4 py-3
                    text-white
                    transition
                    hover:bg-white/10
                  "
                >
                  <div
                    className="
                    flex h-9 w-9 items-center justify-center
                    rounded-lg bg-white/10
                  "
                  >
                    <User size={17} />
                  </div>

                  <div className="text-left">
                    <p className="text-sm font-medium">Profile</p>

                    <p className="text-xs text-slate-300">View your profile</p>
                  </div>
                </Link>

                {/* Settings Link */}
                <Link
                  href="/user/change-password"
                  onClick={() => setProfileOpen(false)}
                  className="
                    flex w-full items-center gap-3
                    px-4 py-3
                    text-white
                    transition
                    hover:bg-white/10
                  "
                >
                  <div
                    className="
                    flex h-9 w-9 items-center justify-center
                    rounded-lg bg-white/10
                  "
                  >
                    <Settings size={17} />
                  </div>

                  <div className="text-left">
                    <p className="text-sm font-medium">Change Password</p>

                    <p className="text-xs text-slate-300">
                      Account preferences
                    </p>
                  </div>
                </Link>

                <div className="mx-4 border-t border-white/10" />

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="
                    flex w-full items-center gap-3
                    px-4 py-3
                    text-red-300
                    transition
                    hover:bg-red-500/10
                  "
                >
                  <div
                    className="
                    flex h-9 w-9 items-center justify-center
                    rounded-lg bg-red-500/10
                  "
                  >
                    <LogOut size={17} />
                  </div>

                  <div className="text-left">
                    <p className="text-sm font-medium">Logout</p>

                    <p className="text-xs text-red-200/70">
                      Sign out of your account
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
