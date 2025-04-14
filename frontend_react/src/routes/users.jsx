import { createFileRoute, useNavigate } from "@tanstack/react-router";
import axios from "axios";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/users")({
  component: UsersComponent,
});

function UsersComponent() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const fetchUsers = () => {
    axios.get("http://localhost:8000/users", { withCredentials: true })
      .then(res => setUsers(res.data))
      .catch(() => {
        navigate({ to: "/login" });
      });
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8000/users/${id}`, { withCredentials: true })
      .then(fetchUsers);
  };

  const handleLogout = () => {
    axios.post("http://localhost:8000/logout", {}, { withCredentials: true })
      .then(() => navigate({ to: "/login" }));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <button onClick={handleLogout}>Wyloguj</button>
      <table>
        <thead>
          <tr>
            <th>Lp</th>
            <th>Email</th>
            <th>ID</th>
            <th>Usuń</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr key={u.id}>
              <td>{i + 1}</td>
              <td>{u.email}</td>
              <td>{u.id}</td>
              <td><button onClick={() => handleDelete(u.id)}>Usuń</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
