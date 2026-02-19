const path = require("path");
const dotenv = require("dotenv");

const envPaths = [
  path.resolve(__dirname, ".env"),
  path.resolve(__dirname, "src/.env"),
];

for (const envPath of envPaths) {
  dotenv.config({
    path: envPath,
    quiet: true,
  });
}

const app = require("./src/app");
const connectDB = require("./src/config/db");

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
