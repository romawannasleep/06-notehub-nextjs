import { HydrationBoundary } from '@tanstack/react-query'
import { QueryClient, dehydrate } from '@tanstack/react-query';
import NotesClient from './Notes.client';
import { fetchNotes } from '../../lib/api';

type Props = {
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default async function Page({ searchParams }: Props) {
  
  const page = Number(Array.isArray(searchParams?.page) ? searchParams?.page[0] : searchParams?.page) || 1;
  const perPage = 12;
  const search = (Array.isArray(searchParams?.search) ? searchParams?.search[0] : searchParams?.search) || '';

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({ queryKey: ['notes', page, search], queryFn: () => fetchNotes({ page, perPage, search }) });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <NotesClient initialPage={page} initialSearch={search} />
    </HydrationBoundary>
  );
}