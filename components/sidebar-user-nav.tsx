'use client';

import { useRouter } from 'next/navigation';
import { useSidebar } from './ui/sidebar';
import type { User } from '@/lib/db/schema';
import { Button } from './ui/button';
import { useClerk } from '@clerk/nextjs';

export function SidebarUserNav({ user }: { user: User | undefined }) {
  const router = useRouter();
  const { setOpenMobile } = useSidebar();
  const { signOut } = useClerk();

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 p-2">
      <Button
        variant="ghost"
        className="justify-start"
        onClick={() => {
          setOpenMobile(false);
          signOut();
          router.push('/');
          router.refresh();
        }}
      >
        Sign out
      </Button>
    </div>
  );
}
