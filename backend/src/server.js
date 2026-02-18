const app = require("./app");
const connectDB = require("./config/database");

connectDB();

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
