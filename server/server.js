require("dotenv").config();
const express = require("express");
const app = express();
const PORT = 5000; // port number local host
const router = require("./router/auth-router");
const contactRoute = require("./router/contact-router");
const planRoute = require("./router/plan-router");
const userData = require("./router/admin-router");
const getContact = require("./router/admin-router");
const paymentRoute = require("./router/payment-router");
const connectDb = require("./utils/db");
const errorMiddleware = require("./middlewares/error-middleware");
const cors = require("cors");

const corsOptions = {
  origin: "https://game-store-pi-steel.vercel.app",
  methods: "GET , POST  , PUT , DELETE ,HEAD , PATCH ",
  credential: true,
};
app.use(cors(corsOptions));

app.use(express.json());

app.use("/api/auth", router);
app.use("/api/form", contactRoute);
app.use("/api/plan", planRoute);
app.use("/api/admin", userData);
app.use("/api/admin", getContact);
app.use("/api/payment", paymentRoute);
app.use(errorMiddleware);
connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`server is running : ${PORT}`);
  });
});
