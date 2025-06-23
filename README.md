# Bookworm App Backend

This is the backend API for the Bookworm App, a platform for users to register, log in, and manage their book collection with image uploads.

## Built With
 ![Node.js](https://img.shields.io/badge/Node.js-20.x-green?logo=node.js)  ![Express](https://img.shields.io/badge/Express-4.x-black?logo=express)  ![MongoDB](https://img.shields.io/badge/MongoDB-6.x-brightgreen?logo=mongodb)  ![Mongoose](https://img.shields.io/badge/Mongoose-8.x-red?logo=mongoose)![Cloudinary](https://img.shields.io/badge/Cloudinary-1.x-blue?logo=cloudinary) ![JWT](https://img.shields.io/badge/JWT-9.x-blueviolet?logo=jsonwebtokens)  ![bcryptjs](https://img.shields.io/badge/bcryptjs-2.x-orange?logo=javascript)  
## Features

- User registration and authentication (JWT)
- Secure password hashing
- Book CRUD operations (Create, Read, Delete)
- Image upload and management via Cloudinary
- Pagination support for book listing
- User-specific book retrieval

## Getting Started

### Prerequisites

- Node.js & npm
- MongoDB database
- Cloudinary account

### Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/yourusername/bookworm-app.git
    cd bookworm-app/backend
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

3. Create a `.env` file in the `backend/` directory with the following variables:

    ```
    PORT=3000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    ```

4. Start the server:

    ```sh
    npm start
    ```

    The server will run on `http://localhost:3000` by default.

## Project Structure
```
backend/
  src/
    index.js
    lib/
      cloudinary.js
      db.js
    middleware/
      auth.middleware.js
    models/
      Book.js
      User.js
    routes/
      authRoutes.js
      bookRoutes.js
  .env
  package.json
  readme.md
```

## API Endpoints

### Auth

- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and receive JWT

### Books

- `POST /api/books` — Create a new book (requires authentication)
- `GET /api/books` — Get all books (paginated, requires authentication)
- `GET /api/books/user` — Get books for the logged-in user
- `DELETE /api/books/:id` — Delete a book by ID (requires authentication)
