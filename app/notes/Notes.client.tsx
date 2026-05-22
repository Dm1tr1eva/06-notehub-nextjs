"use client";

import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import NoteList from "@/components/NoteList/NoteList";
import CreateButton from "@/components/CreateButton/CreateButton";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import { fetchNotes } from "@/src/lib/api";
import css from "./NotesPage.module.css";

const NOTES_PER_PAGE = 12;

type Props = {
  initialPage?: number;
};

export default function NotesClient({ initialPage = 1 }: Props) {
  const [currentPage, setCurrentPage] = useState(initialPage);
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
    refetchOnMount: false,
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

  const handleCreateNote = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

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
        <CreateButton onClick={handleCreateNote} />
      </header>

      <section>
        {isLoading && <p>Loading notes...</p>}
        {isError && <p>Error: {error?.message}</p>}

        {notesData && <NoteList notes={notesData.notes} />}
      </section>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <NoteForm onCancel={handleCloseModal} />
        </Modal>
      )}
    </div>
  );
}
