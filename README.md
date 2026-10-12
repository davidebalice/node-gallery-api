# Node Gallery API

REST API for a photo gallery with a CMS, built with Node.js, Express and MongoDB.
It manages photos and categories, creates resized images and thumbnails on upload, and serves them to the React gallery frontend (masonry, slideshow and 3D gallery).

**Live demo (gallery):** <https://react-gallery.davidebalice.dev>

**Live demo (CMS):** <https://react-gallery-backend.davidebalice.dev>

![Screenshot](https://www.aroundweb.it/screenshot/gallery1.jpg)

![Screenshot](https://www.aroundweb.it/screenshot/gallery2.jpg)

The frontend is available in a separate repository: [react-gallery](https://github.com/davidebalice/react-gallery).

## Features

- JWT authentication (login, logout, signup, password reset)
- Photo upload with Multer, resized images and thumbnails generated with Sharp
- Photo categories with CRUD
- Public endpoints to list photos (all or by category) and serve images and thumbnails
- Dashboard with photo, category and user counters
- User management with roles and profile photo
- Demo mode that blocks write operations
- CORS restricted to allowed origins

## Tech stack

- [Node.js](https://nodejs.org/) and [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- [JSON Web Token](https://github.com/auth0/node-jsonwebtoken) and [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- [Multer](https://github.com/expressjs/multer) and [Sharp](https://sharp.pixelplumbing.com/)
- [Nodemailer](https://nodemailer.com/)

## Getting started

### Requirements

- Node.js 20 or later
- MongoDB (local or Atlas)

### Installation

```bash
git clone https://github.com/davidebalice/node-gallery-api.git
cd node-gallery-api
npm install
mkdir -p uploads/gallery/thumbs uploads/users
```

Sample data (users, categories and photos) is available as MongoDB JSON exports in the `db/` folder and can be imported with `mongoimport`.

### Configuration

Create a `config.env` file in the project root:

```env
NODE_ENV=development
DATABASE=mongodb://127.0.0.1:27017/gallery

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90

FRONTEND_URL=http://localhost:3000
FRONTEND_URL2=http://localhost:3001
BACKEND_URL=http://localhost:8001
LOCALHOST_URL=http://localhost:3000

DEMO_MODE=false
FILE_PATH=/absolute/path/to/project

EMAIL_FROM=noreply@example.com
BREVO_HOST=smtp-relay.brevo.com
BREVO_PORT=587
BREVO_USERNAME=your_smtp_user
BREVO_PASSWORD=your_smtp_password
```

### Run

| Command     | Description                                           |
| ----------- | ----------------------------------------------------- |
| `npm start` | Start the API on `http://localhost:8001` with nodemon |

## API endpoints

All routes are prefixed with `/api`. Routes marked with "auth" require a valid JWT (`Authorization: Bearer <token>`).

### Auth

| Method | Endpoint                    | Description                     |
| ------ | --------------------------- | ------------------------------- |
| POST   | `/api/login`                | Log in and receive a JWT        |
| GET    | `/api/logout`               | Log out                         |
| POST   | `/api/signup`               | Register a new user             |
| POST   | `/api/get/user`             | Get the logged user (auth)      |
| POST   | `/api/forgotPassword`       | Send a password reset email     |
| PATCH  | `/api/resetPassword/:token` | Reset the password with a token |
| PATCH  | `/api/updatePassword`       | Update the password             |

### Public gallery

| Method | Endpoint                      | Description             |
| ------ | ----------------------------- | ----------------------- |
| GET    | `/api/images`                 | List all photos         |
| GET    | `/api/images/:id`             | List photos by category |
| GET    | `/api/images/photo/:filename` | Get a photo             |
| GET    | `/api/images/thumb/:filename` | Get a thumbnail         |
| GET    | `/api/categories`             | List categories         |

### Gallery management (auth)

| Method | Endpoint                       | Description                |
| ------ | ------------------------------ | -------------------------- |
| GET    | `/api/dashboard`               | Get counters for dashboard |
| GET    | `/api/getdemomode`             | Get the demo mode status   |
| GET    | `/api/gallery`                 | List photos                |
| GET    | `/api/gallery/:id`             | List photos by category    |
| POST   | `/api/add/gallery/`            | Upload one or more photos  |
| POST   | `/api/update/photo/`           | Update photo data          |
| POST   | `/api/gallery/delete/:id`      | Delete a photo             |
| GET    | `/api/gallery/photo/:filename` | Get a photo                |
| GET    | `/api/gallery/thumb/:filename` | Get a thumbnail            |
| POST   | `/api/add/category`            | Create a category          |
| GET    | `/api/category/:id`            | Get a category             |
| POST   | `/api/category/:id`            | Update a category          |
| POST   | `/api/category/delete/:id`     | Delete a category          |

### Users (auth)

| Method   | Endpoint                  | Description                    |
| -------- | ------------------------- | ------------------------------ |
| GET      | `/api/profile`            | Get the current user profile   |
| POST     | `/api/profile/update`     | Update the profile             |
| POST     | `/api/profile/password`   | Change the profile password    |
| POST     | `/api/profile/photo`      | Upload the profile photo       |
| GET      | `/api/users`              | List users                     |
| POST     | `/api/add/user`           | Create a user (admin)          |
| GET      | `/api/user/:id`           | Get a user                     |
| POST     | `/api/user/:id`           | Update a user (admin)          |
| POST     | `/api/user/delete/:id`    | Delete a user (admin)          |
| GET/POST | `/api/user/photo/:id`     | Get or upload a user photo     |
| POST     | `/api/user/password/:id`  | Change a user password (admin) |
| GET      | `/api/user/img/:filename` | Get a user image               |
| PATCH    | `/api/updateUser`         | Update user data               |
| POST     | `/api/send/email/user`    | Send an email to a user        |

## Project structure

```text
├── index.js        # Express app setup, MongoDB connection and routes
├── routers/        # Route definitions
├── controllers/    # Request handlers
├── models/         # Mongoose models
├── middlewares/    # Error handling, demo mode, email
├── db/             # Sample data (MongoDB JSON exports)
└── i18n/           # Translations
```

## Author

**Davide Balice** – [davidebalice.dev](https://www.davidebalice.dev)
