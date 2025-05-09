import { useSWRConfig } from 'swr';
import { getChatHistoryPaginationKey } from './use-chat-history';

export function useDeleteChat() {
  const { mutate } = useSWRConfig();

  return {
    mutate: async (chatId: string) => {
      await fetch(`/api/chat/${chatId}`, { method: 'DELETE' });
      await mutate((key) => typeof key === 'string' && key.startsWith('/api/chat'));
    },
  };
} 