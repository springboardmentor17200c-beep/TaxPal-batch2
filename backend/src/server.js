
require("dotenv").config();

const app = require("./utils/app");
const connectDB = require("./config/db");

// 🔥 Connect to database safely
connectDB()
  .then(() => {
    console.log("✅ Database connected");
  })
  .catch((err) => {
    console.error("❌ DB connection failed:", err.message);
    process.exit(1); // stop app if DB fails
  });

// 🔥 Safe PORT handling
const PORT = process.env.PORT || 5000;

// 🔥 Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
