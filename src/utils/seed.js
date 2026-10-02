// Sample data written to Local Storage the very first time the app runs,
// so a marker can log in and see every feature working immediately.
// It is only used when a key does not exist yet.
export const SEED_BOOKS = [
  { id: "book_seed_1", title: "Things Fall Apart", author: "Chinua Achebe", genre: "Fiction", isbn: "978-0385474542", quantity: 5 },
  { id: "book_seed_2", title: "A Brief History of Time", author: "Stephen Hawking", genre: "Science", isbn: "978-0553380163", quantity: 10},
  { id: "book_seed_3", title: "Clean Code", author: "Robert C. Martin", genre: "Technology", isbn: "978-0132350884", quantity: 6 },
  { id: "book_seed_4", title: "Long Walk to Freedom", author: "Nelson Mandela", genre: "Biography", isbn: "978-0316548182", quantity: 3 },
];

export const SEED_USERS = [
  { id: "user_seed_1", name: "Demo Member", memberId: "M001", email: "member@library.test", role: "user" },
  { id: "user_seed_2", name: "Demo Librarian", memberId: "L001", email: "librarian@library.test", role: "librarian" },
];

export const SEED_ADMINS = [
  { adminId: "admin", name: "Library Admin", email: "admin@library.test", password: "admin123", createdAt: "seed" },
];
