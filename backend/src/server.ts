import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import userRoutes from "./routes/user.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "API работает!",
        endpoints: [
            "POST /echo - эхо endpoint",
            "GET /users - все пользователи",
            "POST /users - создать пользователя",
            "GET /users/:id - получить пользователя",
            "DELETE /users/:id - удалить пользователя",
            "GET /users/test/get-test - тест",
            "POST /users/test/create-sample - тест создания"
        ]
    });
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Echo endpoint: POST http://localhost:${PORT}/echo`);
});