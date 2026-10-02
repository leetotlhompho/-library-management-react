// Works out which books a member currently has out by replaying the
// Borrow / Return entries in the transaction log (same rule as the
// original project, but matched on bookId when it exists).
const sameMember = (t, memberId) =>
  String(t.memberId ?? t.member ?? "").toLowerCase() === String(memberId).toLowerCase();

const bookKey = (t) => t.bookId || t.book;

export function getBorrowedBooks(transactions, memberId) {
  if (!memberId) return [];
  const borrowed = [];

  transactions.forEach((t) => {
    if (!sameMember(t, memberId)) return;

    if (t.type === "Borrow") {
      borrowed.push({ key: bookKey(t), bookId: t.bookId, title: t.book, date: t.date });
    } else if (t.type === "Return") {
      const position = borrowed.findIndex((b) => b.key === bookKey(t));
      if (position !== -1) borrowed.splice(position, 1);
    }
  });

  return borrowed;
}
