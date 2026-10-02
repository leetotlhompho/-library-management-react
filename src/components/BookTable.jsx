import { getStockStatus } from "../utils/stock";
import StockBadge from "./StockBadge";

/**
 * Book list used on two pages.
 *  - no onEdit/onDelete  -> read-only availability table (Admin Dashboard)
 *  - with onEdit/onDelete -> editable list with Update / Delete (Book Management)
 * Low-stock (< 2) and out-of-stock rows are highlighted.
 */
export default function BookTable({ books, wrapperClass = "table-wrapper", bodyClass, emptyClass = "empty", emptyText, onEdit, onDelete }) {
  const editable = Boolean(onEdit && onDelete);
  const columns = editable ? 7 : 6;

  return (
    <div className={wrapperClass}>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Genre</th>
            <th>ISBN</th>
            <th>Quantity</th>
            <th>Status</th>
            {editable && <th>Actions</th>}
          </tr>
        </thead>
        <tbody className={bodyClass}>
          {books.length === 0 ? (
            <tr>
              <td colSpan={columns} className={emptyClass}>{emptyText}</td>
            </tr>
          ) : (
            books.map((book) => (
              <tr key={book.id} className={getStockStatus(book.quantity).rowClass}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.genre}</td>
                <td>{book.isbn}</td>
                <td>{Number(book.quantity)}</td>
                <td><StockBadge quantity={book.quantity} /></td>
                {editable && (
                  <td>
                    <button type="button" className="action-btn update-btn" onClick={() => onEdit(book)}>Update</button>
                    <button type="button" className="action-btn delete-btn" onClick={() => onDelete(book)}>Delete</button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
