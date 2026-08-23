"use client";

import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { UserAvatar, useUser } from "@clerk/nextjs";
import {
  Bell,
  BookOpenText,
  ChartBarBig,
  CreditCard,
  House,
  LayoutPanelLeft,
  Settings2,
  UsersRound,
} from "lucide-react";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Highlighter } from "./ui/highlighter";
import { Separator } from "./ui/separator";

export default function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { user } = useUser();
  const businessMenuItems = [
    {
      href: "/admin",
      icon: <House className="size-5 shrink-0" />,
      label: "Home",
    },
    {
      href: "/admin/builder",
      icon: <LayoutPanelLeft className="size-5 shrink-0" />,
      label: "Builder",
    },
    {
      href: "/admin/users",
      icon: <UsersRound className="size-5 shrink-0" />,
      label: "Users & Patrons",
    },
    {
      href: "/admin/menu",
      icon: <BookOpenText className="size-5 shrink-0" />,
      label: "Menu & Promotions",
    },
    {
      href: "/admin/notifications",
      icon: <Bell className="size-5 shrink-0" />,
      label: "Notifications",
    },
    {
      href: "/admin/settings",
      icon: <Settings2 className="size-5 shrink-0" />,
      label: "Settings",
    },
  ];
  const billingMenuItems = [
    {
      href: "/admin/billing",
      icon: <CreditCard className="size-5 shrink-0" />,
      label: "Billing",
    },
    {
      href: "/admin/reports",
      icon: <ChartBarBig className="size-5 shrink-0" />,
      label: "Reports",
    },
  ];

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="h-screen justify-between gap-10 bg-sidebar">
        <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
          {open ? <Logo /> : <LogoIcon />}
          <div className="mt-8 flex flex-col gap-2">
            {businessMenuItems.map((link, idx) =>
              link.href === pathname ? (
                <Highlighter key={idx} action="box" color="#fd6f3b">
                  <SidebarLink link={link} className="text-primary" />
                </Highlighter>
              ) : (
                <SidebarLink key={idx} link={link} />
              ),
            )}
            <Separator decorative />
            {billingMenuItems.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
          </div>
        </div>
        <div>
          <SidebarLink
            link={{
              label: user?.fullName ?? "User",
              href: "#",
              icon: <UserAvatar />,
            }}
          />
        </div>
      </SidebarBody>
    </Sidebar>
  );
}

export const Logo = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-secondary whitespace-pre text-black dark:text-white"
      >
        FEAST Works
      </motion.span>
    </a>
  );
};
export const LogoIcon = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
    </a>
  );
};
