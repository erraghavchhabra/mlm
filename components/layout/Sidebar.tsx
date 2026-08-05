"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { sidebarItems } from "@/data/sidebar";

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (value: boolean) => void;
}

export default function Sidebar({ mobileOpen, setMobileOpen }: SidebarProps) {
  const pathname = usePathname();

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname, setMobileOpen]);

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

  useEffect(() => {
    const parent = sidebarItems.find((item) =>
      item.children?.some((child) => child.href && pathname.startsWith(child.href)),
    );

    if (parent) {
      setOpenMenu(parent.title);
    }
  }, [pathname]);

  return (
    <>
      {/* ================= Overlay ================= */}

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* ================= Sidebar ================= */}

      <motion.aside
        initial={false}
        animate={mobileOpen ? { x: 0 } : { x: "-120%" }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 28,
        }}
        className="
fixed
left-5
top-5
z-50
flex
h-screen
w-[272px]
flex-col
overflow-hidden
rounded-[34px]
border
border-white/10
bg-[linear-gradient(156deg,#27032e_0%,#070735_45%,#4742ca_100%)]
shadow-[0_40px_90px_rgba(0,0,0,.55)]
backdrop-blur-3xl

lg:relative
lg:left-0
lg:top-0
lg:z-auto
lg:h-full
lg:translate-x-0
lg:shrink-0
"
      >
        {/* ================= Background Glow ================= */}

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[#7B79FF]/25 blur-[120px]" />

          <div className="absolute bottom-0 -left-20 h-60 w-60 rounded-full bg-[#4E72FF]/20 blur-[110px]" />

          <div className="absolute right-0 top-1/2 h-40 w-40 rounded-full bg-[#A987FF]/20 blur-[100px]" />
        </div>

        {/* ================= Close ================= */}

        <button
          onClick={() => setMobileOpen(false)}
          className="
          absolute
          right-5
          top-5
          z-20
          rounded-full
          bg-white/10
          p-2
          text-white
          backdrop-blur
          hover:bg-white/20
          lg:hidden
        "
        >
          <X size={18} />
        </button>

        {/* ================= Logo ================= */}

        <div className="relative z-10 px-8 pt-9 pb-8">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-[36px] font-light tracking-tight text-white">
                LOGO
              </h2>

              <p className="mt-1 text-[11px] uppercase tracking-[5px] text-white/45">
                User Suite
              </p>
            </div>
          </div>
        </div>

        {/* ================= Navigation ================= */}

        <nav className="relative z-10 flex-1 overflow-y-auto px-4">
          <div className="space-y-2">
            <div className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;

                const isParentActive =
                  item.children?.some((child) =>
                    child.href && pathname.startsWith(child.href),
                  ) ?? false;

                const isActive = item.href
                  ? pathname === item.href ||
                    pathname.startsWith(item.href + "/")
                  : false;

                // ===========================
                // DROPDOWN MENU
                // ===========================

                if (item.children) {
                  const isOpen = openMenu === item.title;

                  return (
                    <div key={item.title}>
                      <button
                        onClick={() => setOpenMenu(isOpen ? null : item.title)}
                        className={`group flex w-full items-center justify-between rounded-full px-2.5 py-2.5 transition-all duration-300 ${
                          isParentActive
                            ? "bg-white text-[#5E5AF8] shadow-[0_15px_35px_rgba(255,255,255,.12)]"
                            : "text-white/70 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                              isParentActive
                                ? "bg-[#F3F2FF]"
                                : "bg-white/5 group-hover:bg-white/10"
                            }`}
                          >
                            <Icon size={16} />
                          </div>

                          <span className="text-[15px] font-medium">
                            {item.title}
                          </span>
                        </div>

                        <motion.div
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <ChevronDown
                            size={16}
                            strokeWidth={2.3}
                            className="text-current opacity-70"
                          />
                        </motion.div>
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{
                              height: 0,
                              opacity: 0,
                            }}
                            animate={{
                              height: "auto",
                              opacity: 1,
                            }}
                            exit={{
                              height: 0,
                              opacity: 0,
                            }}
                            transition={{
                              duration: 0.25,
                            }}
                            className="overflow-hidden"
                          >
                            <div className="ml-8 mt-3 space-y-2 border-l border-white/10 pl-6">
                              {item.children.map((child) => {
                                const ChildIcon = child.icon;

                                const childActive =
                                  pathname === child.href ||
                                  pathname.startsWith(child.href + "/");

                                return (
                                  <Link
                                    key={child.title}
                                    href={child.href!}
                                    className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                                      childActive
                                        ? "text-[#8B84FF]"
                                        : "text-white/55 hover:text-white"
                                    }`}
                                  >
                                    <ChildIcon size={16} />
                                    {child.title}
                                  </Link>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                // ===========================
                // NORMAL MENU
                // ===========================

                return (
                  <Link key={item.title} href={item.href!}>
                    <motion.div
                      whileHover={{
                        x: 6,
                      }}
                      transition={{
                        duration: 0.2,
                      }}
                      className={`group flex items-center gap-4 rounded-full px-2.5 py-2.5 transition-all duration-300 ${
                        isActive
                          ? "bg-white text-[#5D58F8] shadow-[0_18px_40px_rgba(255,255,255,.15)]"
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                          isActive
                            ? "bg-[#F3F2FF]"
                            : "bg-white/5 group-hover:bg-white/10"
                        }`}
                      >
                        <Icon size={16} />
                      </div>

                      <span className="text-[15px] font-medium">
                        {item.title}
                      </span>

                      {isActive && (
                        <div className="ml-auto h-2.5 w-2.5 rounded-full bg-[#6C63FF]" />
                      )}
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* ================= User Info Card ================= */}

        <div className="relative z-10 p-5 space-y-5">
          <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-3 backdrop-blur-xl">
            <Image
              src="/assets/img/profile.jpg"
              alt=""
              width={52}
              height={52}
              className="rounded-full"
            />

            <div>
              <h4 className="text-white font-medium truncate max-w-[140px]">
                {userName}
              </h4>

              <p className="text-sm text-white/50">User</p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
