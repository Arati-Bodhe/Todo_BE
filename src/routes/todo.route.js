import { Router } from "express";
import { addTodo, completeTodo, deleteTodo, fetchTodo } from "../controllers/todo.controller.js";


const router=Router();
// router.route("/fetch-todo/:id").get(fetchTodo); //route params
router.route("/fetch-todo").get(fetchTodo); //rute params
router.route("/add").post(addTodo);
router.route("/delete-todo").post(deleteTodo);
router.route("/completed-todo").post(completeTodo);

export default router;