# 📚 Library Management System API

A RESTful API for managing books, users, and borrowing transactions — built with Node.js, Express, Mongoose, Joi, Bcrypt, and JWT.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- [nodemon](https://nodemon.io/) (installed globally or via dev dependencies)

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/your-username/library-management-system.git
cd library-management-system

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env
# Then fill in your values (see Environment Variables below)

# 4. Start the server
npm start
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory with the following:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/library-db
JWT_SECRET=your_super_secret_key
```

---

## 🗂️ Project Structure
```
src/
├── main.js                  # Entry point
├── config/
│   └── db.js                # MongoDB connection
├── middlewares/
│   ├── auth.js              # JWT authentication middleware
│   └── roleGuard.js         # Role-based access control middleware
├── models/
│   ├── User.js              # User schema
│   ├── Book.js              # Book schema
│   └── Transaction.js       # Transaction schema
├── routes/
│   ├── users.js             # User routes
│   ├── books.js             # Book routes
│   └── transactions.js      # Transaction routes
├── controllers/
│   ├── userController.js
│   ├── bookController.js
│   └── transactionController.js
└── validators/
    ├── userValidator.js      # Joi schemas for users
    ├── bookValidator.js      # Joi schemas for books
    └── transactionValidator.js
```

---

## 📖 API Documentation

> All routes marked with 🔒 require a valid JWT token in the `Authorization` header:
> ```
> Authorization: Bearer <your_token>
> ```

---

### 👤 Users

#### `POST /api/users/register`
Register a new user. No authentication required.

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "secret123",
  "role": "member"
}
```

**Response `201`:**
```json
{
  "message": "User registered successfully",
  "userId": "64abc..."
}
```

---

#### `POST /api/users/login`
Login and receive a JWT token. No authentication required.

**Request Body:**
```json
{
  "email": "jane@example.com",
  "password": "secret123"
}
```

**Response `200`:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

#### 🔒 `GET /api/users/profile`
Get the authenticated user's profile (password excluded).

**Response `200`:**
```json
{
  "_id": "64abc...",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "role": "member",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

### 📘 Books

#### 🔒 `POST /api/books`
Add a new book. *(Admin only)*

**Request Body:**
```json
{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "publishedYear": 2008,
  "availableCopies": 3
}
```

---

#### 🔒 `GET /api/books`
List all books. Supports optional sorting.

**Query Parameters:**

| Param | Values | Example |
|-------|--------|---------|
| `sortBy` | `title`, `publishedYear` | `?sortBy=title` |
| `order` | `asc`, `desc` | `?order=desc` |

---

#### 🔒 `PUT /api/books/:id`
Update a book by ID. *(Admin only)*

**Request Body:** *(any fields to update)*
```json
{
  "availableCopies": 5
}
```

---

#### 🔒 `DELETE /api/books/:id`
Delete a book by ID. *(Admin only)*

---

#### 🔒 `GET /api/books/search` *(Bonus)*
Search books with filtering and pagination.

**Query Parameters:**

| Param | Description | Example |
|-------|-------------|---------|
| `title` | Partial match on title | `?title=clean` |
| `author` | Partial match on author | `?author=martin` |
| `page` | Page number (default: 1) | `?page=2` |
| `limit` | Results per page (default: 10) | `?limit=5` |

---

### 🔄 Transactions

#### 🔒 `POST /api/transactions/borrow`
Borrow a book. Decrements `availableCopies` and creates a transaction.

**Request Body:**
```json
{
  "bookId": "64xyz..."
}
```

**Response `201`:**
```json
{
  "message": "Book borrowed successfully",
  "transactionId": "64def..."
}
```

---

#### 🔒 `PUT /api/transactions/return/:id`
Return a borrowed book. Updates `returnDate`, status, and increments `availableCopies`. *(Restricted to the borrowing user or admin)*

---

#### 🔒 `GET /api/transactions/user`
Get all transactions for the currently authenticated user, including full book details.

---

#### 🔒 `GET /api/transactions/all` *(Bonus — Admin only)*
Get all transactions in the system.

**Query Parameters:**

| Param | Values | Example |
|-------|--------|---------|
| `status` | `borrowed`, `returned` | `?status=borrowed` |
| `sortBy` | `borrowDate` | `?sortBy=borrowDate` |
| `order` | `asc`, `desc` | `?order=desc` |

---

## 🔐 Security Features

- **JWT Authentication** — All protected routes verify a signed JWT token.
- **Bcrypt Password Hashing** — Passwords are hashed with a salt factor of 10.
- **Joi Validation** — All request bodies are validated before reaching the database.
- **Mongo Sanitization** — `express-mongo-sanitize` prevents NoSQL injection attacks.
- **Rate Limiting** — The `/api/users/login` endpoint is rate-limited using `express-rate-limit` to defend against brute-force attacks *(Bonus)*.

---

## 🎁 Bonus Features Implemented

| Feature | Points | Details |
|---------|--------|---------|
| Role-Based Access Control | 5 | Admin-only routes for book management; users restricted to their own data |
| Advanced Book Search | 5 | `GET /api/books/search` with partial matching and pagination |
| Admin Transaction History | 5 | `GET /api/transactions/all` with filters and sorting |
| Rate Limiting on Login | 5 | 10 requests per 15 minutes per IP using `express-rate-limit` |

---

## ❌ Error Handling

All errors return a consistent JSON format:
```json
{
  "error": "Description of what went wrong"
}
```

| Status Code | Meaning |
|-------------|---------|
| `400` | Bad Request — validation failed |
| `401` | Unauthorized — missing or invalid token |
| `403` | Forbidden — insufficient role/permissions |
| `404` | Not Found — resource doesn't exist |
| `500` | Internal Server Error |

---

## 🧪 Testing with Postman

1. Import the collection or manually create requests.
2. Register a user via `POST /api/users/register`.
3. Login via `POST /api/users/login` and copy the returned token.
4. Set `Authorization: Bearer <token>` in the headers of all protected routes.
5. Test all CRUD, borrow, and return flows.

---

## 📦 Dependencies

| Package | Purpose |
|---------|---------|
| `express` | Web framework |
| `mongoose` | MongoDB ODM |
| `joi` | Input validation |
| `bcrypt` | Password hashing |
| `jsonwebtoken` | JWT auth |
| `dotenv` | Environment variables |
| `express-mongo-sanitize` | NoSQL injection prevention |
| `express-rate-limit` | Login rate limiting |
| `nodemon` | Auto-restart during development |

---

## 📝 License

ISC
