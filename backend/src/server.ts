import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import dotenv from 'dotenv'


dotenv.config()

const app = express();

app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
