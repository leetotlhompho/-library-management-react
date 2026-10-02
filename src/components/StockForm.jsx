import useForm from "../hooks/useForm";
import FormField from "./FormField";
import FlashMessage from "./FlashMessage";

const EMPTY = { bookId: "", quantity: "" };

/** One reusable form for both "Add Stock" and "Deduct Stock". */
export default function StockForm({ title, description, buttonLabel, buttonClass, books, idPrefix, onSubmit, flash, deduct = false }) {
  const validate = (v) => {
    const errors = {};
    if (!v.bookId) errors.bookId = "Please select a book.";
    if (v.quantity === "" || !Number.isInteger(Number(v.quantity)) || Number(v.quantity) <= 0) {
      errors.quantity = "Please enter a valid quantity (1 or more).";
    } else if (deduct && v.bookId) {
      const book = books.find((b) => b.id === v.bookId);
      if (book && Number(v.quantity) > Number(book.quantity)) {
        errors.quantity = `Only ${book.quantity} available.`;
      }
    }
    return errors;
  };

  const { errors, bind, reset, handleSubmit } = useForm(EMPTY, validate);

  const submit = handleSubmit((data) => {
    const result = onSubmit(data.bookId, Number(data.quantity));
    if (result?.ok) reset(EMPTY);
  });

  return (
    <section className="transaction-card">
      <h2>{title}</h2>
      <p>{description}</p>

      <form onSubmit={submit} noValidate>
        <FormField className="" label="Select Book" id={`${idPrefix}Book`} as="select" error={errors.bookId} {...bind("bookId")}>
          <option value="">Select a book</option>
          {books.map((book) => (
            <option key={book.id} value={book.id}>
              {book.title} ({book.quantity} available)
            </option>
          ))}
        </FormField>

        <FormField className="" label="Quantity" id={`${idPrefix}Quantity`} type="number" min="1" placeholder="Enter quantity" error={errors.quantity} {...bind("quantity")} />

        <button type="submit" className={buttonClass}>{buttonLabel}</button>
        <FlashMessage flash={flash} />
      </form>
    </section>
  );
}
