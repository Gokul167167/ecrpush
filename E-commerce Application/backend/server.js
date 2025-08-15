const express = require("express");
const path = require("path");
// const mysql = require("mysql");

// const db = mysql.createConnection({
//   host: "localhost", 
//   user: "root",
//   password: "",
//   database: "ecommerce"
// });

// db.connect(err => {
//   if (err) {
//     console.error("Database connection failed:", err);
//     return;
//   }
//   console.log("Connected to MySQL database");
// });

// 

const app = express();

// Serve React build folder
app.use(express.static(path.join(__dirname, "client", "build")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

