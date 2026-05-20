import { useState } from "react";
import NoteList from "@/components/NoteList/NoteList";
import css from "./NotesPage.module.css";
import CreateButton from "@/components/CreateButton/CreateButton";
import { fetchNotes } from "@/src/lib/api";
import { useDebouncedCallback } from "use-debounce";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

const NOTES_PER_PAGE = 12;

export default function NotesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: notesData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["notes", currentPage, searchQuery],
    queryFn: () =>
      fetchNotes({
        page: currentPage,
        perPage: NOTES_PER_PAGE,
        search: searchQuery || undefined,
      }),
    placeholderData: keepPreviousData,
  });

  const debouncedSearch = useDebouncedCallback((text: string) => {
    setSearchQuery(text);
    setCurrentPage(1);
  }, 500);

  const handleSearch = (text: string) => {
    debouncedSearch(text);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber + 1);
  };

  const pageCount = notesData?.totalPages ?? 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={handleSearch} />

        {pageCount > 1 && (
          <Pagination
            currentPage={currentPage - 1}
            pageCount={pageCount}
            onPageChange={handlePageChange}
          />
        )}
        <CreateButton onClick={() => setIsModalOpen(true)} />
      </header>

      <main>
        {isLoading && <p>Loading notes...</p>}
        {isError && <p>Error: {error?.message}</p>}

        {notesData && <NoteList notes={notesData.notes} />}
      </main>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <NoteForm onCancel={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
