//connect.ts && config.env import
const connect = require("./connect");
require("dotenv").config({path: "./config.env"});

//libs import
const express = require("express");
const cors = require("cors");

//routes import
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", userRoutes);

app.listen(process.env.PORT, () => {
    connect.connectToServer();
    console.log("Server is running on port", process.env.PORT);
}); //.listen() creates server