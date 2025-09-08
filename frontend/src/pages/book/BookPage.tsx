import { useState, useEffect } from "react";
import { retrieveAllBooks } from "../../api/books";
import type { Book } from "../../@types/book";
import { BookCard } from "../../components/book/BookCard";

export function BookPage() {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    retrieveAllBooks().then(setBooks);
  }, []);

  return (
    <>
      {books.map((book) => {
        return (
          <BookCard book={book} key={book._id} />
        )
      })}
    </>
  )
}