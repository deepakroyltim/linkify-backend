# Linkify Backend

A Node.js backend service for URL shortening and QR code generation.

## Features

- URL shortening with custom short codes
- QR code generation for URLs
- User authentication (signup/signin)
- Click tracking
- User-specific link management

## Tech Stack

- Node.js with Express
- MongoDB with Mongoose
- JWT authentication
- QR code generation
- CORS enabled

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with:
   ```
   PORT=5175
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   BASE_URL=http://localhost:5175
   ```

4. Start the server:
   ```bash
   npm run dev    # Development with nodemon
   npm start      # Production
   ```

## API Endpoints

### URL Shortener
- `POST /urlshortener/shorten` - Create short URL
- `GET /urlshortener/:code` - Redirect to original URL
- `GET /urlshortener/user/:userId/links` - Get user's links

### QR Code
- `POST /qrcode/generateqr` - Generate QR code
- `GET /qrcode/user/:userId/links` - Get user's QR codes

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/signin` - User login

## Environment Variables

| Variable | Description |
|----------|-------------|
| PORT | Server port |
| MONGO_URI | MongoDB connection string |
| JWT_SECRET | JWT signing secret |
| NODE_ENV | Environment (development/production) |
| BASE_URL | Base URL for short links |

## Security Notes

- Ensure `.env` file is never committed to version control
- Use strong JWT secrets in production
- Configure CORS properly for production
- Implement rate limiting for production use