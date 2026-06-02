import express, { json } from "express";
import { connect } from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import todoRoutes from "./routes/todoRoutes.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(json());

app.use("/api/todos", todoRoutes);

connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected Successfully"))
    .catch((err) => console.log(err));

app.listen(process.env.PORT, () => {
    console.log(`Server Running On ${process.env.PORT}`);
});