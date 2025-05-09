import { useState } from 'react';

interface UseInfiniteScrollProps {
  data: any[];
  isValidating: boolean;
}

export function useInfiniteScroll({ data, isValidating }: UseInfiniteScrollProps) {
  const [size, setSize] = useState(1);

  return {
    size,
    setSize,
  };
} 