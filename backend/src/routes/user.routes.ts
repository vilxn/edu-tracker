import { Router } from "express";
import {
    createUser,
    getUsers,
    getUserById,
    deleteUser,
    testAPI,
    getTest
} from "../controllers/user.controller";

const router = Router();

router.post("/", createUser);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.delete("/:id", deleteUser);

router.post("/echo", (req, res) => {
    const message = req.body.message || "No message provided";
    console.log("Echo received:", message);
    res.json({
        echo: message,
        timestamp: new Date().toISOString(),
        success: true
    });
})

//Test

export default router;
