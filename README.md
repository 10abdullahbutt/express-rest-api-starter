# Express REST API Starter (TypeScript + MongoDB)

A professional, production-ready Express.js REST API boilerplate written in TypeScript, using MongoDB (Mongoose), with best practices for structure, testing, CI/CD, and developer experience.

## Features

- **TypeScript** for type safety and modern development
- **Express.js** for robust REST APIs
- **MongoDB** with Mongoose ODM
- **Modular structure** (`src/modules`) for scalable code
- **Async error handling** with reusable `asyncHandler`
- **Comprehensive testing** with Jest and Supertest
- **ESLint** and **Prettier** for code quality and formatting
- **Husky** pre-commit hooks for lint, test, and build
- **GitHub Actions** for CI/CD (test, lint, build, coverage)
- **Environment variable management** with dotenv
- **Rate limiting, security, and logging** middleware
- **Example User module** with CRUD endpoints

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd express-rest-api-starter
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy `.env.example` to `.env` and update as needed:

```bash
cp env.example .env
```

### 4. Start MongoDB

Make sure MongoDB is running locally (default: `mongodb://localhost:27017`).

### 5. Run the application

```bash
# For development (with hot reload)
npm run dev

# For production build
npm run build
npm start
```

### 6. Run tests

```bash
npm test
```

## Project Structure

```
src/
  config/         # Database and app config
  middleware/     # Custom Express middleware
  modules/        # Feature modules (e.g., users)
    users/
      controllers/
      models/
      routes/
      services/
      __tests__/
  routes/         # Main API route aggregator
  utils/          # Reusable utilities (e.g., asyncHandler)
  test/           # Test setup
```

## Example API Endpoints

- `GET    /api/v1/users`         - List users
- `GET    /api/v1/users/:id`     - Get user by ID
- `POST   /api/v1/users`         - Create user
- `PUT    /api/v1/users/:id`     - Update user
- `DELETE /api/v1/users/:id`     - Soft delete user

## Lint, Format, and Type Check

```bash
npm run lint      # Lint code
npm run format    # Format code
npm run type-check # TypeScript type check
```

## Husky Pre-commit Hook

Runs lint, test, and build before every commit to ensure code quality.

## GitHub Actions CI/CD

- Runs on push and PR to `main`/`develop`
- Lints, type-checks, tests, and builds
- Uploads coverage to Codecov

## License

MIT 