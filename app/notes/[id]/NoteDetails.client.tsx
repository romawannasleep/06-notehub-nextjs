"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import { QueryClient, QueryClientProvider, hydrate, useQuery } from '@tanstack/react-query';
import type { DehydratedState } from '@tanstack/query-core';
import { fetchNote } from '../../../src/lib/api';
import css from './NoteDetails.module.css';

type Props = {
	dehydratedState?: DehydratedState | null;
};

const NoteDetailsInner: React.FC = () => {
	const params = useParams();
	const id = params?.id;

	const { data: note, isLoading, isError } = useQuery({
		queryKey: ['note', id],
		queryFn: () => fetchNote(id as string),
		enabled: !!id,
	});

	if (isLoading) return <p>Loading, please wait...</p>;
	if (isError || !note) return <p>Something went wrong.</p>;

	return (
		<div className={css.container}>
			<div className={css.item}>
				<div className={css.header}>
					<h2>{note.title}</h2>
				</div>
				<p className={css.tag}>{note.tag}</p>
				<p className={css.content}>{note.content}</p>
				<p className={css.date}>{new Date(note.createdAt).toLocaleString()}</p>
			</div>
		</div>
	);
};

const NoteDetails: React.FC<Props> = ({ dehydratedState }) => {
	const [queryClient] = React.useState(() => new QueryClient());

	React.useEffect(() => {
		if (dehydratedState) {
			hydrate(queryClient, dehydratedState);
		}
	}, [dehydratedState, queryClient]);

	return (
		<QueryClientProvider client={queryClient}>
			<NoteDetailsInner />
		</QueryClientProvider>
	);
};

export default NoteDetails;

