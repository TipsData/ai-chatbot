'use client';

import type { User } from '@/lib/db/schema';
import { SidebarHistory } from './sidebar-history';
import { SidebarUserNav } from './sidebar-user-nav';
import { SidebarMenu } from './ui/sidebar';

export function AppSidebar({ user }: { user: User | undefined }) {
  return (
    <SidebarMenu>
      <SidebarHistory user={user} />
      <SidebarUserNav user={user} />
    </SidebarMenu>
  );
}
