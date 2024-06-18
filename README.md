# URL SHORTENER

[Live version](https://url-shortener-kerem.vercel.app)

### Note on Backend Server Response Time

Please note that if you use the production app, the server is hosted on a free service, which causes it to spin down during periods of inactivity. As a result, the first request may experience a delay of up to 60 seconds as the server wakes up. Subsequent requests should be processed more quickly. This does not apply when running the backend server locally on `localhost`.

## Prerequisites

-   [Node.js](https://nodejs.org/)

## Setup Instructions

### 1. Clone the Repository

```sh
git clone https://github.com/keremilhan/url-shortener.git
cd url-shortener
```

or

```sh
git clone git@github.com:keremilhan/url-shortener.git
cd url-shortener
```

### 2. Configure Environment Variables

Create `.env` files in the client root directory and server root directory then add the following variables:

#### .env file in the Server

```dotenv
FRONTEND_URL_DEVELOPMENT=http://localhost:5000
FRONTEND_URL_PRODUCTION=https://url-shortener-kerem.vercel.app
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
