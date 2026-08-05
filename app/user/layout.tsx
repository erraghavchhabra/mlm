"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div
      className="
      h-screen
      w-screen
      overflow-hidden
      bg-[radial-gradient(circle_at_center,#17113b_0%,#0b1026_35%,#161a48_75%),radial-gradient(circle_at_top_right,#6E5CFF_0%,transparent_10%)]
      relative
    "
    >
   
      {/* Sidebar */}
      <aside
        className="
  fixed
  left-5
  top-5
  z-50
  h-[calc(100vh-40px)]
  "
      >
        <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      </aside>

      {/* Main Wrapper */}
      <section
        className="
  h-screen
  lg:pl-[310px]
  "
      >
        {/* Navbar */}
        <header
          className="
          h-[90px]
          sticky
          top-5
          lg:mr-5
          z-40
          "
        >
          <Navbar setSidebarOpen={setMobileOpen} />
        </header>

        {/* ONLY THIS SCROLLS */}
        <div
          className="
          h-[calc(100vh-90px)]
          overflow-y-auto
          overflow-x-hidden
          px-5
          py-6
          lg:pl-0
          lg:pr-3
          "
        >
          {children}
        </div>
      </section>
    </div>
  );
}
