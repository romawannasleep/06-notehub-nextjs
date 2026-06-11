"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { QueryClient, QueryClientProvider, hydrate, useQuery } from '@tanstack/react-query';
import type { DehydratedState } from '@tanstack/query-core';
import { useDebouncedCallback } from 'use-debounce';
import { fetchNotes } from '../../lib/api';
import Pagination from '../../components/Pagination/Pagination';
import SearchBox from '../../components/SearchBox/SearchBox';
import NoteList from '../../components/NoteList/NoteList';
import Modal from '../../components/Modal/Modal';
import NoteForm from '../../components/NoteForm/NoteForm';
import css from './page.module.css';

type Props = {
  dehydratedState?: DehydratedState | null;
  initialPage?: number;
  initialSearch?: string;
};

const Notes: React.FC<Props> = ({ dehydratedState, initialPage = 1, initialSearch = '' }) => {
  const [queryClient] = useState(() => new QueryClient());
  const [page, setPage] = useState<number>(initialPage);
  const [search, setSearch] = useState<string>(initialSearch);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const perPage = 12;

  useEffect(() => {
    if (dehydratedState) hydrate(queryClient, dehydratedState);
  }, [dehydratedState, queryClient]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', page, search],
    queryFn: () => fetchNotes({ page, perPage, search }),
    staleTime: 5000,
    placeholderData: (previousData) => previousData,
  });

  const handleSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 500);

  const handlePageChange = useCallback((selectedPage: number) => {
    setPage(selectedPage + 1);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className={css.app}>
        <header className={css.toolbar}>
          <SearchBox onChange={handleSearch} />

          {data && data.totalPages > 1 && (
            <Pagination pageCount={data.totalPages} onPageChange={handlePageChange} forcePage={page - 1} />
          )}

          <button className={css.button} onClick={() => setIsModalOpen(true)}>
            Create note +
          </button>
        </header>

        {isLoading && <p>Loading notes...</p>}
        {isError && <p>Error loading notes. Please try again later.</p>}

        {!isLoading && !isError && data?.notes && <NoteList notes={data.notes} />}

        {isModalOpen && (
          <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
            <NoteForm onClose={handleCloseModal} />
          </Modal>
        )}
      </div>
    </QueryClientProvider>
  );
};

export default Notes;
