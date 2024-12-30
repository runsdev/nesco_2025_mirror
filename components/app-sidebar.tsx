'use client';

import * as React from 'react';
import { createClient } from '@/utils/supabase/client';
import {
  AudioWaveform,
  Banknote,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Image,
  Info,
  Map,
  Pencil,
  PieChart,
  Settings2,
  SquareTerminal,
  User2,
} from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import { NavProjects } from '@/components/nav-projects';
import { NavUser } from '@/components/nav-user';
import { TeamSwitcher } from '@/components/team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Paper Competition',
      url: '#',
      icon: Pencil,
      // isActive: true,
      items: [
        {
          title: 'Overview',
          url: '#',
        },
        {
          title: 'Terms and Conditions',
          url: '#',
        },
        {
          title: 'Registration',
          url: '#',
        },
        {
          title: 'Submission',
          url: '#',
        },
      ],
    },
    {
      title: 'Poster Competition',
      url: '#',
      icon: Image,
      items: [
        {
          title: 'Overview',
          url: '#',
        },
        {
          title: 'Terms and Conditions',
          url: '#',
        },
        {
          title: 'Registration',
          url: '#',
        },
        {
          title: 'Submission',
          url: '#',
        },
      ],
    },
    {
      title: 'Documentation',
      url: '#',
      icon: BookOpen,
      items: [
        {
          title: 'Overview',
          url: '#',
        },
        {
          title: 'Terms and Conditions',
          url: '#',
        },
        {
          title: 'Registration',
          url: '#',
        },
        {
          title: 'Submission',
          url: '#',
        },
      ],
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'Overview',
          url: '#',
        },
        {
          title: 'Terms and Conditions',
          url: '#',
        },
        {
          title: 'Registration',
          url: '#',
        },
        {
          title: 'Submission',
          url: '#',
        },
      ],
    },
  ],
  projects: [
    {
      name: 'Profiles',
      url: '#',
      icon: User2,
    },
    {
      name: 'Payment Confirmation',
      url: '#',
      icon: Banknote,
    },
    {
      name: 'Information',
      url: '#',
      icon: Info,
    },
    {
      name: 'Service Desk',
      url: '#',
      icon: Command,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const supabase = createClient();
  const [user, setUser] = React.useState({});

  React.useEffect(() => {
    async function fetchUser() {
      const { data: user } = await supabase.auth.getUser();
      if (!user) return;
      setUser(user);
      data.user.avatar = user?.user?.user_metadata?.avatar_url || '';
      data.user.email = user.user?.email || '';
      data.user.name = user.user?.user_metadata?.full_name || '';
    }
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
