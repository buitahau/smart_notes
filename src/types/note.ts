export type Note = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};

export type CreateNoteData = {
  title: string;
  content: string;
  tags?: string[];
};

export type UpdateNoteData = {
  id: string;
  title?: string;
  content?: string;
  tags?: string[];
};
