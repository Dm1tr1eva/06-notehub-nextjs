import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

const NOTES_PER_PAGE = 12;
const DEFAULT_PAGE = 1;
const DEFAULT_SEARCH = "";

export default async function NotesPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", DEFAULT_PAGE, DEFAULT_SEARCH],
    queryFn: () =>
      fetchNotes({
        page: DEFAULT_PAGE,
        perPage: NOTES_PER_PAGE,
        search: DEFAULT_SEARCH || undefined,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient initialPage={DEFAULT_PAGE} />
    </HydrationBoundary>
  );
}
