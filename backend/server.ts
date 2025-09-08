//connect.ts && config.env import
const connect = require("./connect");
require("dotenv").config({ path: "./config.env" });

//libs import
const express = require("express");
const cors = require("cors");

//routes import
const userRoutes = require("./routes/userRoutes");
const publisherRoutes = require("./routes/publisherRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const bookRoutes = require("./routes/bookRoutes");
const storeRoutes = require("./routes/storeRoutes");

const app = express();

app.use(cors());
app.use(express.json());

//routes array
const routes = [
    userRoutes,
    publisherRoutes,
    reviewRoutes,
    bookRoutes,
    storeRoutes
];

routes.forEach(route => {
    app.use("/api", route);
});

app.listen(process.env.PORT, () => {
    connect.connectToServer();
    console.log("Server is running on port", process.env.PORT);
}); //.listen() creates server