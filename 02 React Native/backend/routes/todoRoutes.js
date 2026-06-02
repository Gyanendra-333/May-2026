import { Router } from "express";
const router = Router();

import { create, find, findByIdAndUpdate, findByIdAndDelete } from "../models/Todo.js";

// Create
router.post("/", async (req, res) => {
    try {
        const todo = await create({
            title: req.body.title,
        });

        res.status(201).json(todo);
    } catch (error) {
        res.status(500).json(error);
    }
});

// Get All
router.get("/", async (req, res) => {
    try {
        const todos = await find().sort({ createdAt: -1 });

        res.json(todos);
    } catch (error) {
        res.status(500).json(error);
    }
});

// Update
router.put("/:id", async (req, res) => {
    try {
        const todo = await findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
            },
            { new: true }
        );

        res.json(todo);
    } catch (error) {
        res.status(500).json(error);
    }
});

// Delete
router.delete("/:id", async (req, res) => {
    try {
        await findByIdAndDelete(req.params.id);

        res.json({
            message: "Todo Deleted",
        });
    } catch (error) {
        res.status(500).json(error);
    }
});

export default router;