"use client";

import * as React from "react";
import {
  Bot,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Phone,
  DollarSign,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from 'next/navigation';

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Don Johnes",
      logo: GalleryVerticalEnd,
      plan: "Max",
    },
  ],
  navMain: [
    {
      title: "Atendimento",
      url: "#",
      icon: Phone,
      isActive: true,
      items: [
        {
          title: "Histórico",
          url: "#",
        },
      ],
    },
    {
      title: "Bot",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Configurações",
          url: "#",
        },
      ],
    },
    {
      title: "Assinatura",
      url: "#",
      icon: DollarSign,
      items: [
        {
          title: "Minha assinatura",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();

  const fetchLoggedUser = async () => {
    try {
      const response = await fetch("/api/auth/loggedUser", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(
          "Você não esta logado, por favor, faça login novamente."
        );
      }
      return data;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Você não esta logado, por favor, faça login novamente.";
      toast.error(message, { position: "top-right" });
      router.push('/auth/login');
    }
  };

  const {
    data: userData
  } = useQuery({
    queryKey: ["userData"],
    queryFn: fetchLoggedUser,
  });
  const currentUser = userData?.user || { name: "", email: "", avatar: "" };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={currentUser} />
      </SidebarFooter>
      <SidebarRail />
      <Toaster />
    </Sidebar>
  );
}
