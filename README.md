💰 TaxPal – Personal Finance & Tax Estimator for Freelancers

TaxPal is a full-stack financial management application designed for freelancers and gig workers to manage income, track expenses, set monthly budgets, and analyze spending patterns.

🚀 Features
🔐 Authentication

User registration & login (JWT)

Secure password hashing (bcrypt)

Protected routes

💸 Transactions

Add income & expense entries

Filter by type & month

Delete transactions

Monthly summary (income, expense, balance)

📊 Dashboard

Total income

Total expenses

Balance

Recent transactions

🗂 Category Management

Default system categories

Custom user categories

Case-insensitive uniqueness

Prevent deletion if linked to transactions

📅 Budget Management

Set monthly budgets per category

One budget per category per month

Budget progress calculation:

Spent amount

Remaining amount

Percentage used

Exceeded status

📈 Analytics

Category-based spending breakdown

Monthly expense distribution

Aggregation pipelines using MongoDB

🛠 Tech Stack

Backend

Node.js

Express.js

MongoDB

Mongoose

JWT Authentication

bcrypt

express-validator

Architecture

MVC pattern

Service layer separation

Centralized error handling

Aggregation pipelines

📁 Project Structure
src/
  config/
  models/
  controllers/
  services/
  routes/
  middlewares/
  utils/
  seed/
  app.js
  server.js
🔧 Installation
1️⃣ Clone Repository
git clone <repo-url>
cd taxpal
2️⃣ Install Dependencies
npm install
3️⃣ Create .env File
PORT=5000
MONGO_URI=mongodb://localhost:27017/taxpal
JWT_SECRET=your_secret_key
4️⃣ Run Server
npm run dev
5️⃣ Seed Database (Optional)
node src/seed/seed.js
🔑 API Base URL
http://localhost:5000/api
📌 Core Endpoints
Auth
POST   /auth/register
POST   /auth/login
Transactions
POST   /transactions
GET    /transactions
GET    /transactions/summary
DELETE /transactions/:id
Categories
POST   /categories
GET    /categories
DELETE /categories/:id
Budgets
POST   /budgets
GET    /budgets?month=YYYY-MM
DELETE /budgets/:id
Analytics
GET /analytics/category-breakdown?month=YYYY-MM
📌 Business Rules

Users access only their own data

One budget per category per month

Category names unique per user (case-insensitive)

Budget only for expense categories

Cannot delete category linked to transactions

Amount must be positive

Date cannot be future

📈 Future Scope

Tax estimation engine

Quarterly reminders

PDF/CSV report export

Cloud deployment

Role-based access

Performance optimization

👩‍💻 Project Purpose

Built as a full-stack backend-focused financial management system demonstrating:

Secure authentication

MongoDB aggregation

Budget tracking logic

Clean scalable architecture
