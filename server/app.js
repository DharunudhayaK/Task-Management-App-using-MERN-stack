const express = require("express");
const dotenv = require("dotenv");
const app = express();
const mongoose = require("mongoose");
dotenv.config({ path: "./config.env" });
const routes = require("./router/routes");
const cors = require("cors");
const bodyParser = require("body-parser");

mongoose
  .connect(process.env.DB_CONNECTION)
  .then(() => console.log("Database connected successfully"))
  .catch((er) => console.log("Database connection error " + er));

app.use(express.json());
app.use(cors());
app.use(bodyParser.text({ type: "text/*" }));

app.listen(process.env.PORT, () => {
  console.log("Server is running");
});

app.use("/todo", routes);

app.all("*", (req, res, next) => {
  res.send({ message: "Unable to route on this url " + req.url });
  next();
});
