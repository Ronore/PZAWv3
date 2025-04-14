import express from 'express';
import cors from 'cors';
import session from 'express-session';
import crypto from 'crypto';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL (lub adres Twojej aplikacji)
  credentials: true,  // Umożliwia przekazywanie ciasteczek (cookies)
}));

// Ustawienia sesji
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }, // Ustaw na 'true', jeśli używasz HTTPS
}));

let users = []; // Tablica do przechowywania użytkowników
let data = [];  // Twoje linki sponsorowane

// === MIDDLEWARE DO SPRAWDZENIA LOGOWANIA ===
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  } else {
    return res.status(401).json({ error: 'Musisz być zalogowany, aby uzyskać dostęp.' });
  }
};

// === REJESTRACJA ===
app.post("/register", (req, res) => {
  const { email, password } = req.body;

  // Sprawdź, czy użytkownik już istnieje
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({ error: "Użytkownik już istnieje" });
  }

  // Dodaj nowego użytkownika
  const newUser = {
    id: crypto.randomUUID(),
    email,
    password, // Pamiętaj, że w prawdziwej aplikacji hasła trzeba haszować!
  };

  users.push(newUser);

  res.status(201).json({ message: "Użytkownik zarejestrowany" });
});

// === LOGOWANIE ===
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Szukaj użytkownika w bazie
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: "Nieprawidłowy e-mail lub hasło" });
  }

  // Zaloguj użytkownika (tutaj zapisujesz go w sesji)
  req.session.user = user;

  res.status(200).json({ message: "Zalogowano", token: "fake-jwt-token" });
});

// === DOSTĘP DO UŻYTKOWNIKÓW — TYLKO DLA ZALOGOWANYCH ===
app.get("/users", isAuthenticated, (req, res) => {
  res.status(200).json(users);
});

// === DODAWANIE DANYCH === (np. linki sponsorowane)
app.post("/", (req, res) => {
  data.push({ id: crypto.randomUUID(), ...req.body });
  res.sendStatus(200);
});

// === POBIERANIE DANYCH === (np. linki sponsorowane)
app.get("/", (req, res) => {
  const sortedData = data.sort((a, b) => {
    if (a.sponsored === b.sponsored) return 0;
    return a.sponsored ? -1 : 1;
  });
  res.status(200).json(sortedData);
});

// === USUWANIE DANYCH === (np. linków)
app.delete("/:id", (req, res) => {
  data = data.filter((item) => item.id !== req.params.id);
  res.sendStatus(200);
});

// === USUWANIE UŻYTKOWNIKA ===
app.delete("/users/:id", isAuthenticated, (req, res) => {
  const { id } = req.params;
  users = users.filter(user => user.id !== id);
  res.status(200).json({ message: "Użytkownik usunięty" });
});

// === WYLOGOWANIE ===
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Błąd przy wylogowywaniu" });
    }
    res.status(200).json({ message: "Wylogowano pomyślnie" });
  });
});
rs

// Uruchomienie serwera
app.listen(8000, () => {
  console.log("Serwer działa na http://localhost:8000");
});
