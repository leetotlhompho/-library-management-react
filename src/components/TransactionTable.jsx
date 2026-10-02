const TYPE_CLASS = {
  "Add Stock": "add-stock",
  "Deduct Stock": "deduct-stock",
  Borrow: "borrow",
  Return: "return",
};

export default function TransactionTable({ transactions }) {
  // newest first, without mutating the stored array
  const rows = [...transactions].reverse();

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Book</th>
            <th>Type</th>
            <th>Quantity</th>
            <th>Date</th>
            <th>Member ID</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={5} className="empty-message">No transactions yet.</td>
            </tr>
          ) : (
            rows.map((t, index) => (
              <tr key={t.id || `${t.date}-${index}`}>
                <td>{t.book}</td>
                <td><span className={`transaction-type ${TYPE_CLASS[t.type] || ""}`}>{t.type}</span></td>
                <td>{t.quantity}</td>
                <td>{t.date}</td>
                <td>{t.memberId || t.member || "Admin"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
