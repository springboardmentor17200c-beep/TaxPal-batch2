💰 TaxPal – Personal Finance & Tax Estimator for Freelancers

TaxPal is a full-stack web application that helps freelancers manage income, track expenses, set monthly budgets, estimate quarterly taxes, and generate financial reports.

🚀 Features
🔐 Authentication

User Registration & Login (JWT)

Secure password hashing (bcrypt)

💸 Transaction Management

Add income & expense entries

Filter by type & month

Delete transactions

Dashboard summary (income, expense, balance)

📂 Category Management

Default + custom categories

Prevent duplicate categories

Cannot delete categories linked to transactions

📊 Budget Management

Set monthly budget per category

Track:

Spent Amount

Remaining Amount

Percentage Used

Exceeded status

📈 Analytics

Category-based spending breakdown

Monthly expense distribution

📑 Reporting (Planned / Extendable)

Monthly & quarterly summaries

Export support (PDF/CSV)

🏗 Tech Stack
Frontend

React.js

Axios

Chart library (Recharts / Chart.js)

Backend

Node.js

Express.js

MongoDB

Mongoose

JWT Authentication

bcrypt

express-validator

📂 Project Structure
src/
  config/
  models/
    user.model.js
    transaction.model.js
    category.model.js
    budget.model.js
  controllers/
  services/
  routes/
  middlewares/
  utils/
  seed/
  app.js
  server.js

Architecture: MVC + Service Layer

⚙️ Installation
1️⃣ Clone Repo
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
🔐 API Base URL
http://localhost:5000/api
📌 Main Endpoints
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
🧠 Business Rules

Users access only their own data

One budget per category per month

Category names are case-insensitive unique per user

Budget only applies to expense categories

Amount must be positive

Date cannot be in future

🧪 Testing

Use Postman to test all protected routes with:

Authorization: Bearer <JWT_TOKEN>
🎯 Project Goal

To help freelancers:

Track income & expenses

Stay within budgets

Understand spending patterns

Prepare for taxes efficiently
