# Storefront(Inventory management)

A RESTful API for an inventory management system with

- User authentication (Admin/Customer)
- Product management
- Category management
- Role-based access control

Built with

- TypeScript
- Express.js
- Prisma ORM
- PostgreSQL
- JWT Authenticatio

## Local Development Setup

1. Clone the Repository

```bash
git clone https://github.com/Ogkpos/storefront-api.git
cd storefront-api
```

2. Install dependencies:

```bash
npm install
```

## Database Configuration

PostgreSQL Setup

1. Install PostgreSQL (if not already installed):

2. Create a dataabse

```bash
psql -U postgres
CREATE DATABASE storefront;
CREATE USER storefront_user WITH PASSWORD 'yourpassword';
GRANT ALL PRIVILEGES ON DATABASE storefront TO storefront_user;
\q
```

## Prisma Setup

1. Initialize Prisma (if not already done):

```bash
npx prisma init
```

2. Configure prisma/schema.prisma:

```bash
prisma
datasource db {
provider = "postgresql"
url = env("DATABASE_URL")
}
generator client {
provider = "prisma-client-js"
}
```

3. After defining your models, run:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

## Environment Variables

1. Create a .env file in the root directory:

```bash
DATABASE_URL="postgresql://storefront_user:yourpassword@localhost:5432/storefront?schema=public"
JWT_SECRET="your_jwt_secret_key_here"
PORT=3000
```

## API Endpoints

1. Authentication

- POST /api/register - Register a new user(admin and customer)

- POST /api/login - Login user

Categories

- GET /api/categories - Get all categories (public)

- GET /api/category/:id - Get category by ID (public)

- POST /api/createCategories - Create category (admin only)

- PUT /api/updateCategory/:id - Update category (admin only)

- DELETE /api/deleteCategory/:id - Delete category (admin only)

Products

- GET /api/product/:id - Get product by ID (public)

- GET /api/product/category/:categoryId - Get products by category (customers)

- POST /api/product/create - Create product (admin only)

- PUT /api/product/update/:id - Update product (admin only)

- DELETE /api/product/delete/:id - Delete product (admin only)
