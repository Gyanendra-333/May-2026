import express, { json } from "express";
import { connect } from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cors());
app.use(json());

app.use("/api/todos", (await import("./routes/todoRoutes.js")).default);

connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));

app.listen(process.env.PORT, () => {
    console.log(`Server Running On ${process.env.PORT}`);
});