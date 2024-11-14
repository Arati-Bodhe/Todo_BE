import { Router } from "express";
import { addTodo, deleteTodo, editTodo, fetchTodo } from "../controllers/todo.controller.js";


const router=Router();
// router.route("/fetch-todo/:id").get(fetchTodo); //route params
router.route("/fetch-todo").get(fetchTodo); //rute params
router.route("/add").post(addTodo);
router.route("/delete-todo").post(deleteTodo);
router.route("/edit-todo").post(editTodo);

export default router;