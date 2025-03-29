const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const authRouter = require("./routes/authRouter");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);
app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

app.listen(process.env.PORT || 3000, () =>
  console.log(`Server running on port ${process.env.PORT || 3000}`)
);
