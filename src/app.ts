import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./modules/auth/auth.routes.js";
import churchRoutes from "./modules/churches/church.routes.js";
import userRoutes from "./modules/users/users.routes.js";

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/churches", churchRoutes);
app.use("/api/users", userRoutes);
app.get("/", (req, res) => {
    res.send("FaithBase API 🚀");
});

export default app;