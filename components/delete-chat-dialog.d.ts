import { FC } from 'react';

interface DeleteChatDialogProps {
  chatId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (chatId: string) => void;
}

export const DeleteChatDialog: FC<DeleteChatDialogProps>; 