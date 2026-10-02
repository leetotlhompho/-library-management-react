import { useEffect } from "react";
import useForm from "../hooks/useForm";
import FormField from "./FormField";
import FlashMessage from "./FlashMessage";

const EMPTY = { name: "", memberId: "", email: "", role: "user" };

function validate(v) {
  const errors = {};
  if (!v.name.trim()) errors.name = "Please enter the user's name.";
  else if (v.name.trim().length < 2) errors.name = "Name must be at least 2 characters.";
  if (!v.memberId.trim()) errors.memberId = "Please enter the Member ID.";
  if (!v.email.trim()) errors.email = "Please enter the email or username.";
  if (!["user", "librarian"].includes(v.role)) errors.role = "Choose a role.";
  return errors;
}

export default function UserForm({ editingUser, onSubmit, onCancel, flash }) {
  const { errors, bind, reset, setValues, handleSubmit } = useForm(EMPTY, validate);
  const editing = Boolean(editingUser);

  useEffect(() => {
    if (editingUser) {
      setValues({
        name: editingUser.name || "", memberId: editingUser.memberId || "",
        email: editingUser.email || "", role: editingUser.role || "user",
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      reset(EMPTY);
    }
  }, [editingUser, setValues, reset]);

  const submit = handleSubmit((data) => {
    const result = onSubmit({
      name: data.name.trim(), memberId: data.memberId.trim(),
      email: data.email.trim(), role: data.role,
    });
    if (result?.ok && !editing) reset(EMPTY);
  });

  return (
    <section className="user-card">
      <h2>{editing ? "Update User" : "Add User"}</h2>
      <p className="card-description">
        {editing ? "Change the details of this user." : "Enter the details of the new library user."}
      </p>

      <form onSubmit={submit} noValidate>
        <div className="form-grid">
          <FormField label="Name" id="userName" type="text" placeholder="Enter user name" error={errors.name} {...bind("name")} />
          <FormField label="Member ID" id="memberId" type="text" placeholder="Enter member ID" error={errors.memberId} {...bind("memberId")} />
          <FormField label="Email / Username" id="email" type="text" placeholder="Enter email or username" error={errors.email} {...bind("email")} />
          <FormField label="Role" id="role" as="select" error={errors.role} {...bind("role")}>
            <option value="user">User (member)</option>
            <option value="librarian">Librarian (admin access)</option>
          </FormField>
        </div>

        <div className="form-buttons">
          <button type="submit" className="add-btn">{editing ? "Update User" : "Add User"}</button>
          {editing && <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>}
        </div>

        <FlashMessage flash={flash} />
      </form>
    </section>
  );
}
