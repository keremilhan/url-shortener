# URL SHORTENER

## Prerequisites

-   [Node.js](https://nodejs.org/)

## Setup Instructions

### 1. Clone the Repository

```sh
git clone git@github.com:keremilhan/url-shortener.git
cd url-shortener
```

### 2. Configure Environment Variables

Create `.env` files in the client root directory and server root directory then add the following variables:

#### .env file in the Server

```dotenv
FRONTEND_URL_DEVELOPMENT=http://localhost:5000
FRONTEND_URL_PRODUCTION=https://url-shortener-five-liart.vercel.app
PORT=3000
MONGODB_URI=<your-mongodb-uri>
MONGO_URI_TEST_DB=<your-mongodb-test-uri>
JWT_SECRET=<your-jwt-secret>
JWT_LIFETIME=40d
```

#### .env file in the Client

```dotenv
VITE_API_URL=<http://localhost:3000>
```

You will receive the MongoDB URI and JWT secret via email.
Replace `<your-mongodb-uri>` `<your-mongodb-test-uri>` and `<your-jwt-secret>` with the values you received in the email.

### 3. Install Dependencies and running the applications

Navigate to both the server and client directories to install the necessary dependencies.

```sh
# Server
cd server
npm install
npm run dev

# Client
cd ../client
npm install
npm run dev
```

-   The backend server will start on port 3000.
-   The frontend server will start on port 5000.
