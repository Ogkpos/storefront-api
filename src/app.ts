import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieSession from "cookie-session";
import { authRouter } from "./routes/authRoutes";
import { categoryRouter } from "./routes/categoryRoute";
import { productRouter } from "./routes/productRoute";

const app = express();

app.use(cors());

app.use(express.json());

app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);

app.use(morgan("dev"));

app.use(authRouter);
app.use(categoryRouter);
app.use(productRouter);

export { app };
