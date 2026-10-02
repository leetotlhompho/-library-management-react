import { useEffect } from "react";
import useForm from "../hooks/useForm";
import FormField from "./FormField";
import FlashMessage from "./FlashMessage";

const EMPTY = { title: "", author: "", genre: "", isbn: "", quantity: "" };

function validate(v) {
  const errors = {};
  if (!v.title.trim()) errors.title = "Title is required.";
  if (!v.author.trim()) errors.author = "Author is required.";
  if (!v.genre.trim()) errors.genre = "Genre is required.";
  if (!v.isbn.trim()) errors.isbn = "ISBN is required.";
  else if (!/^[0-9Xx-]{10,17}$/.test(v.isbn.trim())) errors.isbn = "Enter a valid ISBN (10-13 digits, hyphens allowed).";
  if (v.quantity === "") errors.quantity = "Quantity is required.";
  else if (!Number.isInteger(Number(v.quantity)) || Number(v.quantity) < 0) errors.quantity = "Quantity must be a whole number, 0 or more.";
  return errors;
}

/** Controlled form used for both "Add Book" and "Update Book". */
export default function BookForm({ editingBook, onSubmit, onCancel, flash }) {
  const { values, errors, bind, reset, setValues, handleSubmit } = useForm(EMPTY, validate);
  const editing = Boolean(editingBook);

  // When the user presses "Update" on a row, load that book into the form.
  useEffect(() => {
    if (editingBook) {
      setValues({
        title: editingBook.title, author: editingBook.author, genre: editingBook.genre,
        isbn: editingBook.isbn, quantity: String(editingBook.quantity),
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      reset(EMPTY);
    }
  }, [editingBook, setValues, reset]);

  const submit = handleSubmit((data) => {
    const result = onSubmit({
      title: data.title.trim(), author: data.author.trim(), genre: data.genre.trim(),
      isbn: data.isbn.trim(), quantity: Number(data.quantity),
    });
    if (result?.ok && !editing) reset(EMPTY);
  });

  return (
    <section className="book-card">
      <h2>{editing ? "Update Book" : "Add Book"}</h2>
      <p className="card-description">
        {editing ? "Change the details of this book." : "Enter the details of the new library book."}
      </p>

      <form onSubmit={submit} noValidate>
        <div className="form-grid">
          <FormField label="Title" id="bookTitle" type="text" placeholder="Enter book title" error={errors.title} {...bind("title")} />
          <FormField label="Author" id="bookAuthor" type="text" placeholder="Enter author name" error={errors.author} {...bind("author")} />
          <FormField label="Genre" id="bookGenre" type="text" placeholder="e.g. Fiction" error={errors.genre} {...bind("genre")} />
          <FormField label="ISBN" id="bookISBN" type="text" placeholder="Enter ISBN" error={errors.isbn} {...bind("isbn")} />
          <FormField
            label={editing ? "Quantity in Stock" : "Initial Quantity"}
            id="bookQuantity" type="number" min="0" placeholder="Enter quantity"
            className="form-group quantity-group" error={errors.quantity} {...bind("quantity")}
          />
        </div>

        <div className="form-buttons">
          <button type="submit" className="add-btn">{editing ? "Update Book" : "Add Book"}</button>
          {editing && <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>}
        </div>

        <FlashMessage flash={flash} />
      </form>
    </section>
  );
}
