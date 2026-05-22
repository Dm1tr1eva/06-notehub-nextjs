import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { fetchNotes } from "@/src/lib/api";
import NotesClient from "./Notes.client";

const NOTES_PER_PAGE = 12;
const DEFAULT_PAGE = 1;
const DEFAULT_SEARCH = "";

export default async function NotesPage() {
  // Створюємо новий QueryClient для SSR
  const queryClient = new QueryClient();

  // Prefetch даних на сервері перед рендерингом
  await queryClient.prefetchQuery({
    queryKey: ["notes", DEFAULT_PAGE, DEFAULT_SEARCH],
    queryFn: () =>
      fetchNotes({
        page: DEFAULT_PAGE,
        perPage: NOTES_PER_PAGE,
        search: DEFAULT_SEARCH || undefined,
      }),
  });

  // Передаємо гідратовані дані клієнту
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient initialPage={DEFAULT_PAGE} />
    </HydrationBoundary>
  );
}
