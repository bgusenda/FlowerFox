import type { Book } from "../../@types/book";
// import { Link } from "react-router-dom";

interface BookCardProps {
    book: Book
}

export function BookCard({ book }: BookCardProps) {

    return (
        <div className="bookCard">
            <img src={book.content.coverURL} alt="sa" height={200}/>
            <h2>Título: {book.title}</h2>
            <h2>R$ {book.commercialInfo.price}</h2>
            <h2>Quantidade: {book.commercialInfo.stockQuantity}</h2>
        </div>
    )
}