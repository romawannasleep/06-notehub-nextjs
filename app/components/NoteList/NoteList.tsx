// src/components/NoteList/NoteList.tsx
import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNote } from '../../../src/lib/api';
import type { Note } from '../../../src/types/note';
import css from './NoteList.module.css';

interface NoteListProps {
  notes: Note[];
}

const NoteList: React.FC<NoteListProps> = ({ notes }) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  if (notes.length === 0) return null;

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <a href={`/notes/${note.id}`} className={css.link}>
              View details
            </a>
            <button
              className={css.button}
              onClick={() => handleDelete(note.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && deleteMutation.variables === note.id ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default NoteList;