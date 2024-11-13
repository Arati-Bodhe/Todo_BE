import jwt from "jsonwebtoken";
import { Todo } from "../models/todo.model.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const verifyUser = async (accessToken) => {
    console.log("AccessToken in verifyUser:", accessToken);
    try {
        const decoded = await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        console.log("Decoded:", decoded);
        return decoded;
    } catch (error) {
        throw new ApiError(401, "Unauthorized: Invalid or expired access token");
    }
};

const addTodo = async (req, res) => {
    const { title, description } = req.body;
    const accessToken = req?.headers?.authorization?.split(" ")[1];

    if (!title || !description) {
        return res.status(400).json(new ApiError(400, "Bad Request: Title and description are required"));
    }

    if (!accessToken) {
        return res.status(401).json(new ApiError(401, "Unauthorized: Access token is required"));
    }

    try {
        const verifyAccessToken = await verifyUser(accessToken);
        if (!verifyAccessToken) {
            return res.status(401).json(new ApiError(401, "Unauthorized: Invalid access token"));
        }

        const userId = verifyAccessToken._id;
        const isUserExist = await User.findById(userId);
        if (!isUserExist) {
            return res.status(404).json(new ApiError(404, "User not found"));
        }

        const todo = await Todo.create({
            title,
            description,
            createdBy: userId
        });

        return res.status(201).json(new ApiResponse(201, todo, "Todo created successfully"));
    } catch (error) {
        console.error(error);
        return res.status(500).json(new ApiError(500, "Internal Server Error"));
    }
};

const deleteTodo = () => {
    // Delete Todo function
};

const completeTodo = () => {
    // Complete Todo function
};

const fetchTodo = async (req, res) => {
    const userId = req.query.id;
    if (!userId) {
        return res.status(400).json(new ApiError(400, "Bad Request: User ID is missing"));
    }

    const accessToken = req?.headers?.authorization?.split(" ")[1];
    if (!accessToken) {
        return res.status(401).json(new ApiError(401, "Unauthorized: Access token is required"));
    }

    try {
        const verifyAccessToken = await verifyUser(accessToken);
        if (!verifyAccessToken) {
            return res.status(401).json(new ApiError(401, "Unauthorized: Invalid access token"));
        }

        if (verifyAccessToken._id !== userId) {
            return res.status(403).json(new ApiError(403, "Forbidden: User ID does not match access token"));
        }

        const todoList = await Todo.find({ createdBy: userId });

        return res.status(200).json(new ApiResponse(200, todoList, "Todos fetched successfully"));
    } catch (error) {
        console.error(error);
        return res.status(500).json(new ApiError(500, "Internal Server Error"));
    }
};

export { addTodo, deleteTodo, completeTodo, fetchTodo };
