import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import "./db.js";
import router from "./routes/index.js";
import { isAuthenticated } from "./middleware/auth.js";

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use(isAuthenticated);
app.use("/api", router);

app.listen(process.env.PORT, () =>
  console.log(`🚀 Server running on port ${process.env.PORT}`)
);
