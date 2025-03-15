# Movie App Backend

This is a simple **backend for a movie app** built with **Hono, Drizzle ORM, PostgreSQL, and Arcjet**. It provides **JWT authentication**, **rate limiting**, and **CRUD operations for movies**.

## 🚀 Features

- **Authentication using JWT** (Restricted to `@engimtorino.net` email domain)
- **Per-user rate limiting** (6 requests max, refilling 5 every 10s via Arcjet)
- **Movie CRUD operations**
- **UUID-based IDs for users & movies**
- **Drizzle ORM with PostgreSQL**
- **Actors and Photo URL fields for movies**
- **Optimized for Bun**

---

## 🛠️ Tech Stack

- **Bun** (Runtime)
- **Hono** (Lightweight backend framework)
- **Drizzle ORM** (Database ORM)
- **PostgreSQL** (Database)
- **Arcjet** (Rate limiting)
- **JWT** (Authentication)
- **Biome** (Formatter & Linter)

---

## 📂 Project Setup

### 1️⃣ Install dependencies

```sh
bun install
```

### 2️⃣ Setup environment variables

Create a `.env` file with:

```env
ARCJET_ENV=development
ARCJET_KEY=arcjet_key
DATABASE_URL=db_url
JWT_SECRET=jwt_secret
ALLOWED_DOMAIN=allowed_domain
PORT=3000
PEPPER=pepper
```

### 3️⃣ Apply Database Migrations

```sh
bun run migrate
```

### 4️⃣ Build the project

```sh
bun run build
```

### 5️⃣ Start the backend in development mode

```sh
bun run dev
```

---

## 🔑 Authentication

### Register a User (All fields are mandatory)

```sh
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"email": "student@allowed_domain", "password": "123456", "firstName": "Student", "lastName": "User"}'
```

### Login (Returns JWT Token)

```sh
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email": "student@allowed_domain", "password": "123456"}'
```

_Response:_

```json
{ "token": "your_jwt_token" }
```

### Update User Information (User can update one or more fields)

```sh
curl -X PUT http://localhost:3000/users/id \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{ "password": "newpassword123" }'
```

```sh
curl -X PUT http://localhost:3000/users/id \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{ "firstName": "Updated", "lastName": "User" }'
```

---

## 🎬 Movie Endpoints (Authenticated Requests)

### Get All Movies

```sh
curl -H "Authorization: Bearer your_jwt_token" http://localhost:3000/movies
```

### Add a Movie (All fields are mandatory except `description` and `actors` can be an empty array)

```sh
curl -X POST http://localhost:3000/movies \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Inception",
    "director": "Christopher Nolan",
    "year": 2010,
    "genre": "Sci-Fi",
    "duration": 148,
    "photoUrl": "https://example.com/inception.jpg",
    "description": "A mind-bending thriller about dream manipulation.",
    "actors": []
  }'
```

### Update a Movie (User can update one or more fields of their own movies)

```sh
curl -X PUT http://localhost:3000/movies/{movie_id} \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{ "title": "Updated Title" }'
```

```sh
curl -X PUT http://localhost:3000/movies/{movie_id} \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{ "description": "New description", "photoUrl": "https://example.com/newposter.jpg" }'
```

### Delete a Movie (User can only delete their own movies)

```sh
curl -X DELETE http://localhost:3000/movies/{movie_id} \
  -H "Authorization: Bearer your_jwt_token"
```

---

## 🛡️ Rate Limiting (Arcjet)

- Each user is allowed **6 requests max**.
- Requests **refill at 5 every 10 seconds**.
- **Exceeding the limit returns:**

```json
{ "error": "Too many requests" }
```

---

## ✅ Formatting & Linting with Biome

Run Biome linting:

```sh
bun lint
```

Run Biome formatting:

```sh
bun format
```

---

## 📜 License

MIT

---

### 🚀 Enjoy coding! 🎬
