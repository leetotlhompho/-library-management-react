export default function UserTable({ users, onEdit, onDelete }) {
  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Member ID</th>
            <th>Email / Username</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={5} className="empty">No users available.</td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.memberId}</td>
                <td>{user.email}</td>
                <td><span className="role-user">{user.role || "user"}</span></td>
                <td>
                  <button type="button" className="update-btn" onClick={() => onEdit(user)}>Update</button>
                  <button type="button" className="delete-btn" onClick={() => onDelete(user)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
