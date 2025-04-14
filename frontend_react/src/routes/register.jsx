import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import axios from "axios";

export const Route = createFileRoute("/register")({
  component: RegisterRoute,
});

function RegisterRoute() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    axios
      .post("http://localhost:8000/register", {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      })
      .then((res) => {
        console.log("Zarejestrowano:", res.data);
        setSuccess("Rejestracja udana! Możesz się teraz zalogować.");
      })
      .catch((err) => {
        console.error("Błąd rejestracji:", err);
        setError("Coś poszło nie tak przy rejestracji.");
      });
  };

  return (
    <form onSubmit={handleRegister} className="container row" style={{ maxWidth: "400px" }}>
      <h2>Zarejestruj się</h2>
      <label>
        Email:
        <input type="email" ref={emailRef} required />
      </label>
      <label>
        Hasło:
        <input type="password" ref={passwordRef} required />
      </label>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {success && <div style={{ color: "green" }}>{success}</div>}
      <button type="submit" style={{ width: "100%", marginTop: "1rem" }}>
        Zarejestruj
      </button>
    </form>
  );
}
