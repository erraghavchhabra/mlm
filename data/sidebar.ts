import React from "react";
import {
  BadgeDollarSign,
  CircleUserRound,
  KeyRound,
  LayoutDashboard,
  ShoppingBag,
  User,
  BanknoteArrowDown,
  Network,
  LifeBuoy,
  TicketPlus,
  Tickets,
} from "lucide-react";

interface SidebarItem {
  title: string;
  href?: string;
  icon: React.ComponentType<{ size?: number }>;
  children?: SidebarItem[];
}

export const sidebarItems: SidebarItem[] = [

  {
    title: "Dashboard",
    href: "/user/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Account",
    icon: User,
    children: [
      {
        title: "Profile",
        href: "/user/profile",
        icon: CircleUserRound,
      },
      {
        title: "Change Password",
        href: "/user/change-password",
        icon: KeyRound,
      },
    ],
  },
  {
    title: "Buy Packages",
    href: "/user/packages",
    icon: BadgeDollarSign,
  },
  {
    title: "My Orders",
    href: "/user/orders",
    icon: ShoppingBag,
  },
  {
    title: "Network",
    href: "/user/network",
    icon: Network,
  },
  {
    title: "Withdraw",
    href: "/user/withdraw",
    icon: BanknoteArrowDown,
  },
{
  title: "Support",
  icon: LifeBuoy,
  children: [
    {
      title: "Tickets",
      href: "/user/support/tickets",
      icon: Tickets,
    },
    {
      title: "Create Ticket",
      href: "/user/support/create-ticket",
      icon: TicketPlus,
    },
  ],
}
];