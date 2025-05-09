import useSWRInfinite from 'swr/infinite';
import { fetcher } from '@/lib/utils';

export const CHAT_HISTORY_PAGE_SIZE = 10;

export function getChatHistoryPaginationKey(pageIndex: number, previousPageData: any) {
  if (previousPageData && !previousPageData.hasMore) return null;
  return `/api/chat?page=${pageIndex}&limit=${CHAT_HISTORY_PAGE_SIZE}`;
}

export function useChatHistory({ userId }: { userId?: string }) {
  const { data, ...rest } = useSWRInfinite(
    (pageIndex, previousPageData) => getChatHistoryPaginationKey(pageIndex, previousPageData),
    fetcher,
    {
      revalidateFirstPage: false,
      revalidateOnFocus: false,
    }
  );

  return {
    data: data || [],
    ...rest
  };
} 