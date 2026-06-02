import Todo from "../models/Todo.js";

// Get All Todos
export const getTodos = async (req, res) => {
    try {
        const todos = await Todo.find().sort({ createdAt: -1 });

        res.status(200).json(todos);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Create Todo
export const createTodo = async (req, res) => {
    try {
        const { title } = req.body;

        const todo = await Todo.create({
            title,
        });

        res.status(201).json(todo);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Update Todo
export const updateTodo = async (req, res) => {
    try {
        const todo = await Todo.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json(todo);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Delete Todo
export const deleteTodo = async (req, res) => {
    try {
        await Todo.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Todo Deleted Successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};