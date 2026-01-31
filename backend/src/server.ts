import express from "express";
import cors from "cors";
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.post("/echo", (req, res) => {
    const message = req.body.message || "No message provided";
    console.log("Echo received:", message);
    res.json({
        echo: message,
        timestamp: new Date().toISOString(),
        success: true
    });
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Echo endpoint: POST http://localhost:${PORT}/echo`);
});