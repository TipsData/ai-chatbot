'use client';

import { useRouter } from 'next/navigation';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { useSidebar } from './ui/sidebar';
import type { Chat, User } from '@/lib/db/schema';
import { ChatItem } from './sidebar-history-item';
import { SidebarMenu } from './ui/sidebar';
import { useChatHistory } from '@/hooks/use-chat-history';
import { useDeleteChat } from '@/hooks/use-delete-chat';
import { useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { DeleteChatDialog } from './delete-chat-dialog';
import { motion } from 'framer-motion';

export interface ChatHistory {
  chats: Array<Chat>;
  hasMore: boolean;
}

export function SidebarHistory({ user }: { user: User | undefined }) {
  const { setOpenMobile } = useSidebar();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: paginatedChatHistories, isValidating } = useChatHistory({
    userId: user?.id,
  });

  const { size, setSize } = useInfiniteScroll({
    data: paginatedChatHistories,
    isValidating,
  });

  const { mutate: mutateDeleteChat } = useDeleteChat();

  const onDelete = useCallback(
    async (chatId: string) => {
      await mutateDeleteChat(chatId);
      if (chatId === id) {
        router.push('/');
        router.refresh();
      }
    },
    [id, mutateDeleteChat, router],
  );

  const hasReachedEnd =
    paginatedChatHistories &&
    paginatedChatHistories[paginatedChatHistories.length - 1]?.hasMore === false;

  return (
    <>
      <SidebarMenu>
        {(() => {
          const chatsFromHistory = paginatedChatHistories.flatMap(
            (paginatedChatHistory) => paginatedChatHistory.chats,
          );

          const groupedChats = chatsFromHistory.reduce(
            (acc, chat) => {
              const now = new Date();
              const chatDate = new Date(chat.createdAt);
              const diffInDays = Math.floor(
                (now.getTime() - chatDate.getTime()) / (1000 * 60 * 60 * 24),
              );

              if (diffInDays <= 30) {
                acc.lastMonth.push(chat);
              } else {
                acc.older.push(chat);
              }

              return acc;
            },
            { lastMonth: [] as Array<Chat>, older: [] as Array<Chat> },
          );

          return (
            <div className="flex flex-col gap-2">
              {groupedChats.lastMonth.length > 0 && (
                <div>
                  <div className="px-2 py-1 text-xs text-sidebar-foreground/50">
                    Last 30 days
                  </div>
                  {groupedChats.lastMonth.map((chat) => (
                    <ChatItem
                      key={chat.id}
                      chat={chat}
                      isActive={chat.id === id}
                      onDelete={(chatId) => {
                        setDeleteId(chatId);
                        setShowDeleteDialog(true);
                      }}
                      setOpenMobile={setOpenMobile}
                    />
                  ))}
                </div>
              )}

              {groupedChats.older.length > 0 && (
                <div>
                  <div className="px-2 py-1 text-xs text-sidebar-foreground/50">
                    Older than last month
                  </div>
                  {groupedChats.older.map((chat) => (
                    <ChatItem
                      key={chat.id}
                      chat={chat}
                      isActive={chat.id === id}
                      onDelete={(chatId) => {
                        setDeleteId(chatId);
                        setShowDeleteDialog(true);
                      }}
                      setOpenMobile={setOpenMobile}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })()}
      </SidebarMenu>

      <motion.div
        onViewportEnter={() => {
          if (!isValidating && !hasReachedEnd) {
            setSize((size) => size + 1);
          }
        }}
      />

      <DeleteChatDialog
        chatId={deleteId}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onDelete={onDelete}
      />
    </>
  );
}
