import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import axios from "axios";

export const Route = createFileRoute("/login")({
  component: LoginComponent,
});

function LoginComponent() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError(null);

    axios.post("http://localhost:8000/login", {
      email: emailRef.current.value,
      password: passwordRef.current.value
    }, { withCredentials: true })
      .then(() => {
        navigate({ to: "/users" });
      })
      .catch(() => {
        setError("Nieprawidłowe dane logowania");
      });
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Logowanie</h2>
      <input type="email" ref={emailRef} placeholder="Email" required />
      <input type="password" ref={passwordRef} placeholder="Hasło" required />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit">Zaloguj</button>
    </form>
  );
}
