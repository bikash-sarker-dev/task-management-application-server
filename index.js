require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.SERVER_PORT;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("task management server open");
});

app.listen(port, () => {
  console.log(`the server running port : ${port}`);
});
