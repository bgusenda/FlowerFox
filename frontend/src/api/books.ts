import type { Book } from "../@types/book";

import { request, buildQueryParams } from "./api";

// API functions
export const retrieveAllBooks = () => request<Book[]>("get", "/api/books");

export const retrieveBooks = (filters: Record<string, any> = {}) => {
  const query = buildQueryParams(filters);
  return request<Book[]>("get", `/api/books${query ? "?" + query : ""}`);
};

export const retrieveOneBook = (id: string) =>
  request<Book>("get", `/api/books/${id}`);

export const createBook = (book: Book) =>
  request("post", "/api/books", book);

export const updateBook = (id: string, book: Book) =>
  request("put", `/api/books/${id}`, book);

export const deleteBook = (id: string) =>
  request("delete", `/api/books/${id}`);
